import express from 'express';
import {
  getBookById,
  createBook,
  getBooks,
} from '../../controllers/v1/books.controller';
const router = express.Router();

router.get('/', getBooks);

router.get('/:book_id', getBookById);

router.post('/', createBook);

export default router;
