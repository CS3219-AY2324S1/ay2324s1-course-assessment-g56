import { createClient } from '@supabase/supabase-js';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import 'dotenv/config';

const app = express();
const allowedOrigins = [process.env.FRONTEND_SERVICE];

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

app.get('/user', async (_req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Deletes a user
 *
 * Currently it just wipes all attributes of the user in the profiles table without removing the corresponding row
 * and id
 *
 * To do a full delete, we will need to clean the auth.users table as well. Need to write new triggers for that
 *
 *Alternatively, we can keep it as it is and do a soft delete (set isDeleted to true) and remove all profile data instead of a hard delete
 */
app.delete('/user', async (_req, res) => {
  try {
    const { data } = await supabase.from('profiles').select('id').single();
    if (data) {
      const { error } = await supabase.auth.admin.deleteUser(data.id as string);
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.sendStatus(204);
      }
    }
  } catch (error) {
    res.status(401).json({
      errors: [{ msg: 'Something Went Wrong' }],
    });
  }
});

const server = app.listen(process.env.USER_SERVICE_PORT, () => {
  console.log(`> Ready on port:${process.env.USER_SERVICE_PORT}`);
});

export { app, server };
