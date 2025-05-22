import express from 'express';
import {
  getBookById,
  createBook,
  getBooks,
  createReview,
} from '../../controllers/v1/books.controller';
import { requireAuth } from '../../middlewares/requireAuth';
const router = express.Router();

router.get('/', getBooks);

router.get('/:book_id', getBookById);

router.post('/', requireAuth, createBook);

router.post('/:book_id/reviews', requireAuth, createReview);

export default router;
