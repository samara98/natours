const createHttpError = require('http-errors');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/user-model');
const catchAsync = require('../utils/catch-async');
const HandleFactory = require('./handler-factory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

class UserController {
  static uploadUserPhoto = upload.single('photo');

  static resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  });
  static getMe = catchAsync(async (req, res, next) => {
    req.params.id = req.user.id;
    return next();
  });

  static updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError('This route is not for password updates. Please use /updateMyPassword.', 400),
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    const result = {
      data: {
        user: updatedUser,
      },
      meta: {
        status: res.statusCode,
      },
    };
    return res.json(result);
  });

  static deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204);
    return res.json({});
  });

  static createUser = catchAsync(async (req, res, next) => {
    throw createHttpError(500, 'This route is not defined! Please use /signup instead');
  });

  static getAllUsers = HandleFactory.getAll(User);
  static getUser = HandleFactory.getOne(User);

  // Do NOT update passwords with this!
  static updateUser = HandleFactory.updateOne(User);
  static deleteUser = HandleFactory.deleteOne(User);
}

module.exports = UserController;
