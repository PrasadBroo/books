import express from 'express';
import booksRouter from './books';
import authRouter from './auth';
import { requireAuth } from '../../middlewares/requireAuth';
import reviewsRouter from './reviews';
import searchRouter from './search';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);

apiRouter.use('/books', booksRouter);

apiRouter.use('/reviews', requireAuth, reviewsRouter);

apiRouter.use('/search', searchRouter);

export default apiRouter;
