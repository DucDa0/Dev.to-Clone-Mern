const { check } = require('express-validator');
exports.validSign = [
  check('name', 'Name is required')
    .notEmpty()
    .isLength({
      min: 4,
      max: 32,
    })
    .withMessage('name must be between 3 to 32 characters'),
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password', 'password is required').notEmpty(),
  check('password')
    .isLength({
      min: 6,
      max: 32,
    })
    .withMessage('Password must be between 6 to 32 characters')
    .matches(/\d/)
    .withMessage('password must contain a number'),
];

exports.validLogin = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password', 'password is required').notEmpty(),
  check('password')
    .isLength({
      min: 6,
    })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('password must contain a number'),
];

exports.forgotPasswordValidator = [
  check('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Must be a valid email address'),
];

exports.resetPasswordValidator = [
  check('newPassword')
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 32 })
    .withMessage('Password must be between 6 to 32 characters'),
];

exports.validUpdateUser = [
  check('name', 'Name is required')
    .notEmpty()
    .isLength({
      min: 4,
      max: 32,
    })
    .withMessage('Name must be between 3 to 32 characters'),
  check('email', 'Email is required')
    .notEmpty()
    .isEmail()
    .withMessage('Must be a valid email address'),
];
