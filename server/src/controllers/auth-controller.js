const express = require('express');
const createHttpError = require('http-errors');

const User = require('../models/user-model');
const catchAsync = require('../utils/catch-async');
const { signPayload, verifyToken } = require('../utils/jwt');

const signToken = (id) => {
  return signPayload({ id });
};

const createSendToken = (user, statusCode, req = express.request, res = express.response) => {
  const token = signToken(user._id);

  res.cookie('_JWT_', token, {
    maxAge: 1000 * 60 * 60 * 24 * (process.env.JWT_COOKIE_EXPIRES_IN || 30),
    httpOnly: true,
    sameSite: 'lax',
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode);
  const result = {
    data: {
      token,
      user,
    },
    meta: {
      status: res.statusCode,
    },
  };
  return res.json(result);
};

class AuthController {
  static register = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const url = `${req.protocol}://${req.get('host')}/me`;
    // console.log(url);
    // await new Email(newUser, url).sendWelcome();

    return createSendToken(newUser, 201, req, res);
  });

  static login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    return createSendToken(user, 200, req, res);
  });

  static logout = catchAsync(async (req, res, next) => {
    res.clearCookie('_JWT_');
    res.status(204);
    return res.json({});
  });

  static protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies['_JWT_']) {
      token = req.cookies['_JWT_'];
    }

    if (!token) {
      throw createHttpError(401, 'You are not logged in! Please log in to get access.');
    }

    // 2) Verification token
    const decoded = verifyToken(token);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw createHttpError(401, 'The user belonging to this token does no longer exist.');
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw createHttpError(401, 'User recently changed password! Please log in again.');
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    return next();
  });

  // Only for rendered pages, no errors!
  static isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        // 1) verify token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        // 2) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          return next();
        }

        // 3) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }

        // THERE IS A LOGGED IN USER
        res.locals.user = currentUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };

  static restrictTo = (...roles) => {
    return (req, res, next) => {
      // roles ['admin', 'lead-guide']. role='user'
      if (!roles.includes(req.user.role)) {
        throw createHttpError(403, 'You do not have permission to perform this action');
      }

      return next();
    };
  };
}

module.exports = AuthController;
