import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  // process.env.SUPABASE_ANON_KEY || '',
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || '',
);

export default supabase;
