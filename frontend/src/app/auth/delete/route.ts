import supabase from '@/utils/supabaseClient';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabaseUserClient = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  // Check if we have a session
  const {
    data: { session },
  } = await supabaseUserClient.auth.getSession();

  const supabaseAuthClient = supabase;

  const adminAuthClient = supabaseAuthClient.auth.admin;

  if (session === undefined || session === null) {
    console.error('No user ID provided');
    return NextResponse.redirect(new URL('/', req.url));
  }

  const { data, error } = await adminAuthClient.deleteUser(session.user.id);

  console.log('data: ', data);

  if (error) {
    console.log('error:', error);
  }

  return NextResponse.redirect(new URL('/', req.url));
}
