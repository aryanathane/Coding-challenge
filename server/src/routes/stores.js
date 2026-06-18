import express from 'express';
import { body } from 'express-validator';
import {
  createStore,
  getStoresAdmin,
  browseStores,
  getMyStore,
} from '../controllers/storesController.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();

router.use(authenticate);

router.get('/browse', roleGuard('user'), browseStores);

router.get('/my-store', roleGuard('store_owner'), getMyStore);

router.get('/', roleGuard('admin'), getStoresAdmin);

router.post(
  '/',
  roleGuard('admin'),
  [
    body('name').trim().notEmpty().withMessage('Store name is required.'),
    body('email').trim().isEmail().withMessage('Please provide a valid store email.'),
    body('address').optional({ checkFalsy: true }).isLength({ max: 400 }).withMessage('Address must not exceed 400 characters.'),
    body('ownerId').optional({ checkFalsy: true }).isUUID().withMessage('ownerId must be a valid UUID.'),
  ],
  validate,
  createStore
);

export default router;