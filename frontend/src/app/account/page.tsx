import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';
import AccountForm from '@/components/form/AccountForm';

export default async function Account() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <AccountForm session={session} />;
}
