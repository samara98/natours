const express = require('express');

// const bookingRouter = require('./routes/booking-router');
const reviewRouter = require('./routes/review-router');
const tourRouter = require('./routes/tour-router');
const userRouter = require('./routes/user-router');
const errorHandler = require('./utils/error-handler');

const router = express.Router();
const api = express.Router();

api.use('/v1/users', userRouter);
api.use('/v1/tours', tourRouter);
api.use('/v1/reviews', reviewRouter);
// api.use('/v1/bookings', bookingRouter);

api.use(...errorHandler, async (req, res) => {
  const result = {
    ...res.locals,
    metadata: { status: res.statusCode },
  };
  return res.json(result);
});

/* GET home page. */
router.get('/', async (req, res, next) => {
  return res.render('index', { title: 'Express' });
});

router.use('/api', api);

module.exports = router;
