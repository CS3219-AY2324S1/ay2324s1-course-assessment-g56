import { createClient, PostgrestError } from '@supabase/supabase-js';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import express from 'express';

const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || '',
);

app.get('/user', async (req, res) => {
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
app.delete('/user', async (req, res) => {
  const jwt = req.headers.authorization;
  if (!jwt) {
    res
      .status(401)
      .json({ errors: [{ msg: 'Not authorized, no access token' }] });
  } else {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(jwt);
    if (error) {
      res
        .status(401)
        .json({ errors: [{ msg: 'Not authorized, access token failed' }] });
    } else {
      const { data, error } = await supabase.auth.admin.deleteUser(user.id);
      console.log('data: ', data);
      if (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
});

app.listen(process.env.USER_SERVICE_PORT, () => {
  console.log(`> Ready on port:${process.env.USER_SERVICE_PORT}`);
});
