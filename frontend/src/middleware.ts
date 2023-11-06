import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export default async function authMiddleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient(
    { req, res },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    },
  );
  const url = req.nextUrl.clone();

  const { data } = await supabase
    .from('profiles')
    .select('full_name, username, preferred_interview_language')
    .single();

  const hasOnboarded =
    data?.full_name && data?.username && data?.preferred_interview_language;

  if (data && !hasOnboarded && req.nextUrl.pathname !== '/onboarding') {
    return NextResponse.redirect(
      new URL('/onboarding', process.env.FRONTEND_SERVICE),
    );
  }

  if (data && hasOnboarded && req.nextUrl.pathname === '/onboarding') {
    return NextResponse.redirect(
      new URL('/account', process.env.FRONTEND_SERVICE),
    );
  }

  // If the user is signed in and they are on the '/' route, redirect them to '/home'.
  if (data && req.nextUrl.pathname === '/') {
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  // If the user is not signed in and they are on any route other than '/', redirect them to the custom page.
  if (!data && req.nextUrl.pathname !== '/') {
    url.pathname = '/';
    url.searchParams.set('return_to', encodeURIComponent(req.nextUrl.pathname));
    return NextResponse.redirect(url);
  }

  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: [
    '/',
    '/home',
    '/question/:id*',
    '/matching',
    '/account',
    '/room/:id*',
    '/onboarding',
  ],
};
