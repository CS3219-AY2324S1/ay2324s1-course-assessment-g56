// 'use server';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

import { useEffect, useState } from 'react';

export default function AuthForm({ returnUrl }: { returnUrl: string }) {
  const supabase = createClientComponentClient<Database>({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  });

  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    setRedirectUrl(
      `${process.env.FRONTEND_SERVICE}/auth/callback?return_to=${returnUrl}
    `);
  }, []);

  return (
    <Auth
      supabaseClient={supabase}
      view="magic_link"
      appearance={{
        theme: ThemeSupa,
        style: {
          anchor: { color: 'blue' },
          message: { color: 'black' },
        },
      }}
      theme="dark"
      showLinks={false}
      providers={[]}
      redirectTo={redirectUrl}
    />
  );
}