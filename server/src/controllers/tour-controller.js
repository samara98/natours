const createHttpError = require('http-errors');
const multer = require('multer');
const sharp = require('sharp');
const Booking = require('../models/booking-model');

require('../models/review-model');
const Tour = require('../models/tour-model');
const catchAsync = require('../utils/catch-async');
const HandleFactory = require('./handler-factory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(createHttpError(400, 'Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

class TourController {
  static uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
  ]);

  static resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();

    // 1) Cover image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);

    // 2) Images
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${filename}`);

        req.body.images.push(filename);
      }),
    );

    next();
  });

  static getTourStats = catchAsync(async (req, res, next) => {
    const statuses = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    const result = {
      data: {
        statuses,
      },
      meta: {
        status: res.statusCode,
      },
    };
    return res.json(result);
  });

  static getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    const result = {
      data: {
        plan,
      },
      meta: {
        status: res.statusCode,
      },
    };
    return res.json(result);
  });

  static getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
      throw createHttpError(400, 'Please provide latitutr and longitude in the format lat,lng.');
    }

    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    const result = {
      data: {
        tours,
      },
      meta: {
        status: res.statusCode,
        length: tours.length,
      },
    };
    return res.json(result);
  });

  static getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
      throw createHttpError(400, 'Please provide latitutr and longitude in the format lat,lng.');
    }

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    const result = {
      data: {
        distances,
      },
      meta: {
        status: res.statusCode,
        length: distances.length,
      },
    };
    return res.json(result);
  });

  static aliasTopTours = catchAsync(async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    return next();
  });

  static getAllTours = HandleFactory.getAll(Tour);

  static createTour = HandleFactory.createOne(Tour);

  static getTour = HandleFactory.getOne(Tour, { path: 'reviews' });

  static updateTour = HandleFactory.updateOne(Tour);

  static deleteTour = HandleFactory.deleteOne(Tour);

  static getTourSlug = catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'review rating user',
    });

    if (!tour) {
      throw createHttpError(404, 'There is no tour with that name.');
    }

    const result = {
      data: {
        tour,
      },
      meta: {
        status: res.statusCode,
      },
    };
    return res.json(result);
  });

  static getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    const result = {
      data: {
        tours,
      },
      meta: {
        status: res.statusCode,
        length: tours.length,
      },
    };
    return res.json(result);
  });
}

module.exports = TourController;
