import { body } from 'express-validator';

// Name: Min 20 characters, Max 60 characters.
export const nameValidator = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters.');

// Email: standard email format.
export const emailValidator = body('email')
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email address.')
  .normalizeEmail();

// Address: Max 400 characters. Optional in some forms.
export const addressValidator = body('address')
  .optional({ checkFalsy: true })
  .isLength({ max: 400 })
  .withMessage('Address must not exceed 400 characters.');

// Password: 8-16 characters, at least one uppercase letter, at least one special character.
export const passwordValidator = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be between 8 and 16 characters.')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter.')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character.');

// Rating: must be an integer between 1 and 5.
export const ratingValidator = body('score')
  .isInt({ min: 1, max: 5 })
  .withMessage('Rating must be an integer between 1 and 5.');