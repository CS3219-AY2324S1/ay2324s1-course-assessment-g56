'use client';

import { ColorModeScript } from '@chakra-ui/react';
import Head from './head';
import AppProvider from '../contexts/AppProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <Head />
      <body>
        <ColorModeScript type="cookie" nonce="testing" />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
