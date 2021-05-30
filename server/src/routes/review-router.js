const express = require('express');

const AuthController = require('../controllers/auth-controller');
const ReviewController = require('../controllers/review-controller');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(AuthController.protect);

reviewRouter
  .route('/')
  .get(ReviewController.getAllReviews)
  .post(
    AuthController.restrictTo('user'),
    ReviewController.setTourUserIds,
    ReviewController.createReview,
  );

reviewRouter
  .route('/:id')
  .get(ReviewController.getReview)
  .patch(AuthController.restrictTo('user', 'admin'), ReviewController.updateReview)
  .delete(AuthController.restrictTo('user', 'admin'), ReviewController.deleteReview);

module.exports = reviewRouter;
