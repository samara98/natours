const Review = require('../models/review-model');
const catchAsync = require('../utils/catch-async');
const HandleFactory = require('./handler-factory');

class ReviewController {
  static setTourUserIds = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    return next();
  });

  static getAllReviews = HandleFactory.getAll(Review);
  static getReview = HandleFactory.getOne(Review);
  static createReview = HandleFactory.createOne(Review);
  static updateReview = HandleFactory.updateOne(Review);
  static deleteReview = HandleFactory.deleteOne(Review);
}

module.exports = ReviewController;
