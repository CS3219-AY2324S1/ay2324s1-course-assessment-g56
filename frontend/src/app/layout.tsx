import AppProvider from '@/contexts/AppProvider';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'PeerPrep',
  description: 'Mock interviews have never been easier.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const defaultTheme = 'dark';
  const uiColorMode =
    (cookieStore.get('chakra-ui-color-mode')?.value as 'light' | 'dark') ||
    defaultTheme;

  return (
    <html
      lang="en"
      data-theme={uiColorMode}
      style={{ colorScheme: uiColorMode }}
    >
      <head />
      <body className={`chakra-ui-${uiColorMode}`}>
        <AppProvider colorMode={uiColorMode}>{children}</AppProvider>
      </body>
    </html>
  );
}
