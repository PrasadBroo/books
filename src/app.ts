import express from 'express';

import { errorHandler } from './middlewares/errorHandler';
import apiRouter from './routes/v1';

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1', apiRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
