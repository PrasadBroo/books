import express from 'express';
import { searchBooks } from '../../controllers/v1/search.controller';

const router = express.Router();

router.get('/', searchBooks);

export default router;
