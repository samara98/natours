const createHttpError = require('http-errors');

const errorHandler = [
  // catch 404 and forward to error handler
  async (req, res, next) => {
    return next(createHttpError(404));
  },
  // error handler
  async (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    return next();
  },
];

module.exports = errorHandler;
