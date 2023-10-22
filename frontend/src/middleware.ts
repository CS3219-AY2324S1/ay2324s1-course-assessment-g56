import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export default async function authMiddleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const url = req.nextUrl.clone();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is signed in and they are on the '/' route, redirect them to '/home'.
  if (user && req.nextUrl.pathname === '/') {
    url.pathname = '/home';
    return NextResponse.rewrite(url);
  }

  // If the user is not signed in and they are on any route other than '/', redirect them to the custom page.
  if (!user && req.nextUrl.pathname !== '/') {
    url.pathname = '/';
    url.searchParams.set('return_to', encodeURIComponent(req.nextUrl.pathname));
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/', '/home', '/question/:id*', '/matching', '/account'],
};
