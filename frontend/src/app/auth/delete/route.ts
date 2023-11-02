import initialiseClient from '@/lib/axios';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();
  const supabaseUserClient = createRouteHandlerClient(
    { cookies: () => cookieStore },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    },
  );

  // Check if we have a session
  const {
    data: { session },
  } = await supabaseUserClient.auth.getSession();

  if (!session) {
    console.error('No user ID provided');
    return NextResponse.redirect(new URL('/', process.env.FRONTEND_SERVICE));
  }

  const client = initialiseClient(session.access_token);

  await client.delete(`${process.env.USER_SERVICE}/user`).catch((error) => {
    console.error('Error deleting user:', error);
  });

  return NextResponse.redirect(new URL('/', process.env.FRONTEND_SERVICE), {
    status: 301,
  });
}
