import AppProvider from '@/contexts/AppProvider';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export const metadata = {
  title: 'PeerPrep',
  description: 'Mock interviews have never been easier.',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const defaultTheme = 'dark';
  const uiColorMode =
    (cookieStore.get('chakra-ui-color-mode')?.value as 'light' | 'dark') ||
    defaultTheme;
  const supabase = createServerComponentClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    },
  );
  const { data } = await supabase.auth.getSession();
  const session = data?.session ?? null;

  return (
    <html
      lang="en"
      data-theme={uiColorMode}
      style={{ colorScheme: uiColorMode }}
    >
      <head />
      <body className={`chakra-ui-${uiColorMode}`}>
        <AppProvider colorMode={uiColorMode} session={session}>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
