import { ColorModeScript } from '@chakra-ui/react';
import AppProvider from '@/contexts/AppProvider';
import { ReactNode } from 'react';
import theme from '@/styles/theme';

export const metadata = {
  title: 'PeerPrep',
  description: 'Mock interviews have never been easier.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme={theme.config.initialColorMode}>
      <body>
        <ColorModeScript type="cookie" nonce="testing" />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
