const express = require('express');

const AuthController = require('../controllers/auth-controller');
const BookingController = require('../controllers/booking-controller');

const bookingRouter = express.Router();

bookingRouter.use(AuthController.protect);

// bookingRouter.get('/checkout-session/:tourId', BookingController.getCheckoutSession);

bookingRouter.use(AuthController.restrictTo('admin', 'lead-guide'));

bookingRouter
  .route('/')
  .get(BookingController.getAllBookings)
  .post(BookingController.createBooking);

bookingRouter
  .route('/:id')
  .get(BookingController.getBooking)
  .patch(BookingController.updateBooking)
  .delete(BookingController.deleteBooking);

module.exports = bookingRouter;
