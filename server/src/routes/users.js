import express from 'express';
import { body } from 'express-validator';
import {
  getDashboardStats,
  createUser,
  getUsers,
  getUserById,
} from '../controllers/usersController.js';
import { nameValidator, emailValidator, addressValidator, passwordValidator } from '../utils/validators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();

router.use(authenticate, roleGuard('admin'));

router.get('/dashboard-stats', getDashboardStats);

router.get('/', getUsers);

router.post(
  '/',
  [
    nameValidator,
    emailValidator,
    passwordValidator,
    addressValidator,
    body('role')
      .isIn(['admin', 'user', 'store_owner'])
      .withMessage('Role must be admin, user, or store_owner.'),
  ],
  validate,
  createUser
);

router.get('/:id', getUserById);

export default router;