const express = require('express');

const AuthController = require('../controllers/auth-controller');
const TourController = require('../controllers/tour-controller');
const reviewRouter = require('./review-router');

const tourRouter = express.Router();

// router.param('id', TourController.checkID);

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter.route('/top-5-cheap').get(TourController.aliasTopTours, TourController.getAllTours);

tourRouter.route('/tour-stats').get(TourController.getTourStats);
tourRouter
  .route('/monthly-plan/:year')
  .get(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide', 'guide'),
    TourController.getMonthlyPlan,
  );

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(TourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

tourRouter.route('/distances/:latlng/unit/:unit').get(TourController.getDistances);

tourRouter.route('/slug/:slug').get(TourController.getTourSlug);

tourRouter.route('/my-tours').get(AuthController.protect, TourController.getMyTours);

tourRouter
  .route('/')
  .get(TourController.getAllTours)
  .post(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    TourController.createTour,
  );

tourRouter
  .route('/:id')
  .get(TourController.getTour)
  .patch(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    TourController.uploadTourImages,
    TourController.resizeTourImages,
    TourController.updateTour,
  )
  .delete(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    TourController.deleteTour,
  );

module.exports = tourRouter;
