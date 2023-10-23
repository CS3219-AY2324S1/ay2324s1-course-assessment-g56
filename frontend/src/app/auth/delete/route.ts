import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();
  const supabaseUserClient = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  // Check if we have a session
  const {
    data: { session },
  } = await supabaseUserClient.auth.getSession();

  if (!session) {
    console.error('No user ID provided');
    return NextResponse.redirect(new URL('/', process.env.FRONTEND_SERVICE));
  }

  try {
    await axios.delete(`${process.env.USER_SERVICE}/user`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
  }

  return NextResponse.redirect(new URL('/', process.env.FRONTEND_SERVICE));
}
