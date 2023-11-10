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

app.post(
  '/create',
  cors({
    origin(origin, callback) {
      if (!origin || origin === process.env.MATCHING_SERVICE) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
  }),
  async (req, res) => {
    const response = await fetch(
      `${process.env.QUESTION_SERVICE}/questions/random/${req.body.difficulty}`,
    );
    const questions = await response.json();
    req.body.user1_question_slug = questions[0].slug;
    req.body.user2_question_slug = questions[1].slug;
    const { data, error } = await supabase
      .from('collaborations')
      .insert([req.body])
      .select();
    if (error) {
      return res.status(500).json(error);
    }
    return res.status(200).json(data);
  },
);

app.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  console.log(roomId);
  const { data } = await supabase
    .from('collaborations')
    .select(
      'room_id, difficulty, user1_question_slug, user2_question_slug, user1_id, user2_id',
    )
    .eq('room_id', roomId)
    .single();

  console.log(data);

  const { data: user1Details } = await supabase
    .from('profiles')
    .select('username, avatar_url, preferred_interview_language')
    .eq('id', data?.user1_id)
    .single();

  console.log(user1Details);

  const { data: user2Details } = await supabase
    .from('profiles')
    .select('username, avatar_url, preferred_interview_language')
    .eq('id', data?.user2_id)
    .single();
  return res.status(200).json({ ...data, user1Details, user2Details });
});

app.get('/', async (req, res) => {
  const { user } = req.query;
  const userQuery = `user1_id.eq.${user},user2_id.eq.${user}`;
  const { data } = await supabase.from('collaborations').select().or(userQuery);
  return res.status(200).json(data);
})

const server = app.listen(process.env.ROOM_SERVICE_PORT, () => {
  console.log(`> Ready on port:${process.env.ROOM_SERVICE_PORT}`);
});

export { server, app };
