import { createClient } from '@supabase/supabase-js';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import morgan from 'morgan';

import 'dotenv/config';

const app = express();
const allowedOrigins = [
  process.env.FRONTEND_SERVICE,
  process.env.MATCHING_SERVICE,
];

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

// CORS middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    // 403 if blocked due to disallowed origin
    res.status(403).json({ error: 'Access to this resource is forbidden' });
  } else {
    // Other Error
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || '',
);

app.post('/create', async (req, res) => {
  const { data, error } = await supabase
    .from('collaborations')
    .insert([req.body])
    .select();
  return res.status(200).json(data);
});

app.get('/', async (req, res) => {
  const {data, error} = await supabase.from('collaborations').select().eq('room_id', req.query.room_id);
  return res.status(200).json(data);
});

const server = app.listen(process.env.ROOM_SERVICE_PORT, () => {
  console.log(`> Ready on port:${process.env.ROOM_SERVICE_PORT}`);
});

export { server, app };
