const mongoose = require('mongoose');
const createHttpError = require('http-errors');

const catchAsync = require('../utils/catch-async');
const APIFeatures = require('../utils/api-features');

class HandleFactory {
  static deleteOne = (Model = mongoose.Model) =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        throw createHttpError(404, 'No document found with that ID');
      }

      res.status(204);
      return res.json({});
    });

  static updateOne = (Model = mongoose.Model) =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        throw createHttpError(404, 'No document found with that ID');
      }

      res.status(200);
      const result = {
        data: doc,
        meta: {
          status: res.statusCode,
        },
      };
      return res.json(result);
    });

  static createOne = (Model = mongoose.Model) =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.create(req.body);

      res.status(201);
      const result = {
        data: doc,
        meta: {
          status: res.statusCode,
        },
      };
      return res.json(result);
    });

  static getOne = (Model = mongoose.Model, popOptions) =>
    catchAsync(async (req, res, next) => {
      let query = Model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);
      const doc = await query;

      if (!doc) {
        throw createHttpError(404, 'No document found with that ID');
      }

      res.status(200);
      const result = {
        data: doc,
        meta: {
          status: res.statusCode,
        },
      };
      return res.json(result);
    });

  static getAll = (Model = mongoose.Model) =>
    catchAsync(async (req, res, next) => {
      // To allow for nested GET reviews on tour (hack)
      let filter = {};
      if (req.params.tourId) filter = { tour: req.params.tourId };

      const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      // const doc = await features.query.explain();
      const doc = await features.query;

      // SEND RESPONSE
      res.status(200);
      const result = {
        data: doc,
        meta: {
          status: res.statusCode,
          length: doc.length,
        },
      };
      return res.json(result);
    });
}

module.exports = HandleFactory;
