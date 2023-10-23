import { PostgrestError, createClient } from "@supabase/supabase-js";
import express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || '',
);

app.get('/profiles', async (req, res) => {
  const { id } = req.body;

  try {
    if (!id) {
      // Dispatch all users if no id is provided
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      res.json(data);
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id);
      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(data[0]);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generates a magic link for a user to login or signup
 *
 * The defacto Create route for users
 */
app.get('/profiles/magic-link', async (req, res) => {
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const { data, error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    return res.status(500).json(data);
  }

  res.json(data);
});

/**
 * This is both an update and insert route.
 * https://supabase.com/docs/reference/dart/upsert
 * Upsert creates the row if it doesn't exist, otherwise it updates it.
 * Primary key must be included in the updates.
 *
 * Note: Insert should be handled by magic link invite
 *
 * Updates comes in the form:
 * {id, username, website, avatarURL, updated_at}
 *
 * This faces issues when ran on the server side due to RLS, need to figure out a way to pass auth details
 */
app.put('/profiles', async (req, res) => {
  const { updates } = req.body;

  try {
    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) throw error;
    res.json({ message: 'Updated successfully' });
  } catch (error: any) {
    res.status(500).json({
      error: `Failed to insert updates: ${JSON.stringify(updates)}. Error: ${
        error.message
      }`,
    });
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
app.delete('/profiles', async (req, res) => {
  const { id } = req.body;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .delete()
      .match({ id });
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.USER_SERVICE_PORT, () => {
  console.log(`> Ready on http://localhost:${process.env.USER_SERVICE_PORT}`);	
});
