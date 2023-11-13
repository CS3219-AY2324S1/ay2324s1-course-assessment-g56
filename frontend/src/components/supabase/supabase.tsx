import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

export const supabaseAnon = createClientComponentClient<Database>({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
});

// export const supabaseService = createClientComponentClient<Database>({
//   supabaseUrl: process.env.SUPABASE_URL,
//   supabaseKey: process.env.SUPABASE_SERVICE_KEY,
// });
