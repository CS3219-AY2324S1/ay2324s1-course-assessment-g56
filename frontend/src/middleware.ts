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

  // console.log(user); // TODO: Remove once middleware implemented. This is to avoid eslint issues when pushing commits.
  /**
   * TODO: Fix the reloading issue, middleware is stuck in boundcing between '/' and '/home'
   *
   * Or find an altaernate way to check if user is signed in and shift the logic to other pages
   */

  // If the user is signed in and they are on the '/' route, redirect them to '/home'.
  if (user && req.nextUrl.pathname === '/') {
    url.pathname = '/home';
    return NextResponse.rewrite(url);
  }

  // // If the user is not signed in and they are on any route other than '/', redirect them to the custom page.
  if (!user && req.nextUrl.pathname !== '/') {
    url.pathname = '/';
    url.searchParams.set('return_to', encodeURIComponent(req.nextUrl.pathname));
    return NextResponse.redirect(url);
  }
  //   return new NextResponse.HTML(`
  //     <html>
  //       <body>
  //         <h1>Please log in</h1>
  //         <p>You need to be logged in to access this page.</p>
  //         <button onclick="window.location.href='/'">Go to Login</button>
  //       </body>
  //     </html>
  //   `);
  // }

  return res;
}

export const config = {
  matcher: ['/', '/home', '/question/:id*', '/matching', '/account'],
};
