// 'use server';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabase } from '@/contexts/SupabaseProvider';

export default function AuthForm({ returnUrl }: { returnUrl: string }) {
  const supabase = useSupabase();

  const redirectUrl = `${process.env.FRONTEND_SERVICE}/auth/callback?return_to=${returnUrl}`;

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
      providers={['github']}
      redirectTo={redirectUrl}
    />
  );
}
