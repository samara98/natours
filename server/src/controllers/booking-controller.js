const Booking = require('../models/booking-model');
const catchAsync = require('../utils/catch-async');
const HandleFactory = require('./handler-factory');

class BookingController {
  static createBooking = HandleFactory.createOne(Booking);
  static getBooking = HandleFactory.getOne(Booking);
  static getAllBookings = HandleFactory.getAll(Booking);
  static updateBooking = HandleFactory.updateOne(Booking);
  static deleteBooking = HandleFactory.deleteOne(Booking);
}

module.exports = BookingController;
