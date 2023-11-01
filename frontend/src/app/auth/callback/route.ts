import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('getting callback');
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient(
    { cookies: () => cookieStore },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    },
  );
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const returnUrl = searchParams.get('return_to') || '/home';

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const { data } = await supabase
    .from('profiles')
    .select('updated_at')
    .single();

  const hasOnboarded = !!data?.updated_at;

  if (!hasOnboarded) {
    return NextResponse.redirect(
      new URL('/onboarding', process.env.FRONTEND_SERVICE),
    );
  }
  return NextResponse.redirect(
    new URL(returnUrl, process.env.FRONTEND_SERVICE),
  );
}
