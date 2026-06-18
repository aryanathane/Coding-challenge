import express from 'express';
import { body } from 'express-validator';
import { register, login, changePassword } from '../controllers/authController.js';
import { nameValidator, emailValidator, addressValidator, passwordValidator } from '../utils/validators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();


router.post(
  '/register',
  [nameValidator, emailValidator, passwordValidator, addressValidator],
  validate,
  register
);


router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Please provide a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  login
);

router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .withMessage('New password must be between 8 and 16 characters.')
      .matches(/[A-Z]/)
      .withMessage('New password must contain at least one uppercase letter.')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('New password must contain at least one special character.'),
  ],
  validate,
  changePassword
);

export default router;