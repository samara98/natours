const express = require('express');

const AuthController = require('../controllers/auth-controller');
const UserController = require('../controllers/user-controller');

const userRouter = express.Router();

userRouter.post('/register', AuthController.register);
userRouter.post('/login', AuthController.login);
userRouter.post('/logout', AuthController.logout);

// userRouter.post('/forgotPassword', AuthController.forgotPassword);
// userRouter.patch('/resetPassword/:token', AuthController.resetPassword);

// Protect all routes after this middleware
userRouter.use(AuthController.protect);

// userRouter.patch('/updateMyPassword', AuthController.updatePassword);
userRouter.get('/me', UserController.getMe, UserController.getUser);
userRouter.patch(
  '/update-me',
  // UserController.uploadUserPhoto,
  // UserController.resizeUserPhoto,
  UserController.updateMe,
);
userRouter.delete('/delete-me', UserController.deleteMe);

userRouter.use(AuthController.restrictTo('admin'));

userRouter.route('/').get(UserController.getAllUsers).post(UserController.createUser);

userRouter
  .route('/:id')
  .get(UserController.getUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);

module.exports = userRouter;
