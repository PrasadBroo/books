import express from 'express';
import { getBookById, createBook } from '../../controllers/v1/books.controller';
const router = express.Router();

// router.get('/', getAllBooks);

router.get('/:book_id', getBookById);

router.post('/', createBook);

export default router;
