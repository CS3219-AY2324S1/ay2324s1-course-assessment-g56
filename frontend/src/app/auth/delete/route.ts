import supabase from '@/utils/supabaseClient';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabaseUserClient = createRouteHandlerClient({ cookies });

  // Check if we have a session
  const {
    data: { session },
  } = await supabaseUserClient.auth.getSession();

  const supabaseAuthClient = supabase;

  const adminAuthClient = supabaseAuthClient.auth.admin;

  if (session == undefined) {
    console.error('No user ID provided');
    return NextResponse.redirect(new URL('/', req.url));
  }

  const { data, error } = await adminAuthClient.deleteUser(session.user.id);

  console.log('data: ', data);

  return NextResponse.redirect(new URL('/', req.url));
}