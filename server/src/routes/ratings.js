import express from 'express';
import { body } from 'express-validator';
import { submitRating, deleteRating } from '../controllers/ratingsController.js';
import { ratingValidator } from '../utils/validators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();
router.use(authenticate, roleGuard('user'));

router.post(
  '/',
  [
    body('storeId').isUUID().withMessage('storeId must be a valid UUID.'),
    ratingValidator,
  ],
  validate,
  submitRating
);

router.delete('/:storeId', deleteRating);

export default router;