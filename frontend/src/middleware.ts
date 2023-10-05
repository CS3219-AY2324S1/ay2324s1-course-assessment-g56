import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export default async function authMiddleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /**
   * TODO: Fix the reloading issue, middleware is stuck in boundcing between '/' and '/home'
   *
   * Or find an altaernate way to check if user is signed in and shift the logic to other pages
   */

  // If the user is signed in and they are on the '/' route, redirect them to '/home'.
  // if (user && req.nextUrl.pathname === '/') {
  //   return NextResponse.redirect('/home');
  // }

  // // If the user is not signed in and they are on any route other than '/', redirect them to the custom page.
  // if (!user && req.nextUrl.pathname !== '/') {
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
  matcher: ['/', '/home'],
};
