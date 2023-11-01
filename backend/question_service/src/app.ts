import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import morgan from 'morgan';

import 'dotenv/config';

import * as AuthMiddleWare from './middleware/authMiddleware';
import questionRoutes from './routes/questions';
import adminQuestionRoutes from './routes/questionsAdmin';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_SERVICE,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

/**
 * Firebase routes
 */

app.use('/questions', AuthMiddleWare.verifyAccessToken, questionRoutes);
app.use('/admin/questions', AuthMiddleWare.protectAdmin, adminQuestionRoutes);

app.use((_req, _res, next) => {
  next(createHttpError(404, 'Not Found'));
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  let message = 'Something went wrong';
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    message = error.message;
  }
  res.status(statusCode).json({ message });
});

const server = app.listen(process.env.QUESTION_SERVICE_PORT, () => {
  console.log(`> Ready on port:${process.env.QUESTION_SERVICE_PORT}`);
});

export { app, server };
