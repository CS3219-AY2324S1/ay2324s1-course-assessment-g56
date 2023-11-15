import { createClient } from '@supabase/supabase-js';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import morgan from 'morgan';

import 'dotenv/config';

import { verifyAccessToken } from './middleware/authMiddleware';

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
  `https://${process.env.SUPABASE_URL}` || '',
  process.env.SUPABASE_SERVICE_KEY || '',
);

dayjs.extend(duration);

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
    .select('*')
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

app.get('/', verifyAccessToken, async (_req, res) => {
  const { user } = res.locals;
  const userQuery = `user1_id.eq.${user},user2_id.eq.${user}`;

  const { data, error } = await supabase
    .from('collaborations')
    .select()
    .or(userQuery)
    .eq('is_closed', true);
  if (error) {
    return res.status(500).json(error);
  }
  if (!data) {
    return res.status(200).json([]);
  }

  const getPartnerId = (collab: any) =>
    collab.user1_id === user ? collab.user2_id : collab.user1_id;
  const { data: usersData, error: usersError } = await supabase
    .from('profiles')
    .select()
    .in(
      'id',
      data.map((collab) => getPartnerId(collab)),
    );
  if (usersError) {
    return res.status(500).json(usersError);
  }

  const getUserWithId = (id: string) => {
    const user = usersData.find((profile) => profile.id === id);
    return {
      id: user?.id,
      username: user?.username,
      avatarUrl: user?.avatar_url,
      preferredInterviewLanguage: user?.preferred_interview_language,
    };
  };
  const collabList = data.map((collab) => ({
    collabId: collab.room_id,
    partner: getUserWithId(getPartnerId(collab)),
    completedTime: dayjs(collab.completed_time).format('MMM DD, YYYY'),
    duration: dayjs
      .duration(dayjs(collab.completed_time).diff(dayjs(collab.created_at)))
      .format('HH:mm:ss'),
    language:
      collab.user1_id === user ? collab.user1_language : collab.user2_language,
  }));

  return res.status(200).json(collabList);
});

const server = app.listen(process.env.ROOM_SERVICE_PORT, () => {
  console.log(`> Ready on port:${process.env.ROOM_SERVICE_PORT}`);
});

export { server, app };
