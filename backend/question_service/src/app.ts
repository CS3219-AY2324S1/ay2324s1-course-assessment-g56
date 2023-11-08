import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import morgan from 'morgan';

import { getTwoRandomQuestionsByDifficulty } from 'controllers/questions';

import 'dotenv/config';

import * as AuthMiddleWare from './middleware/authMiddleware';
import questionRoutes from './routes/questions';
import adminQuestionRoutes from './routes/questionsAdmin';

const app = express();
const allowedOrigins = [process.env.FRONTEND_SERVICE, process.env.ROOM_SERVICE];

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

/**
 * Firebase routes
 */
app.get(
  '/questions/random/:difficulty',
  cors({
    origin(origin, callback) {
      if (!origin || origin === process.env.ROOM_SERVICE) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
  }),
  getTwoRandomQuestionsByDifficulty,
);
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
  res.status(statusCode).json({ errors: [{ msg: message }] });
});

const server = app.listen(process.env.QUESTION_SERVICE_PORT, () => {
  console.log(`> Ready on port:${process.env.QUESTION_SERVICE_PORT}`);
});

export { app, server };
