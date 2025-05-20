import express from 'express';
import booksRouter from './books';
const apiRouter = express.Router();

apiRouter.use('/books', booksRouter);

export default apiRouter;
