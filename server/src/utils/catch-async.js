const express = require('express');

const catchAsync = (fn = async (req = express.request, res = express.response, next) => {}) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
