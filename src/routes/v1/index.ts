import express from 'express';
import booksRouter from './books';
import authRouter from './auth';
import { requireAuth } from '../../middlewares/requireAuth';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/books',requireAuth, booksRouter);

export default apiRouter;
