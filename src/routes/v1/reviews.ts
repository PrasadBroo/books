import express from 'express';
import {
  deleteReview,
  updateReview,
} from '../../controllers/v1/reviews.controller';
const router = express.Router();

router.put('/:review_id', updateReview);

router.delete('/:review_id', deleteReview);

export default router;
