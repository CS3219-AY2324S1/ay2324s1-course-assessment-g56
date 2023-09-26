'use client';

import { ColorModeScript } from '@chakra-ui/react';
import AppProvider from '@/contexts/AppProvider';
import { ReactNode } from 'react';
import Navbar from '@/components/navBar/NavBar';
import Head from './head';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <Head />
      <body>
        <ColorModeScript type="cookie" nonce="testing" />
        <AppProvider>
          <Navbar>{children}</Navbar>
        </AppProvider>
      </body>
    </html>
  );
}
