'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, cookieStorageManager } from '@chakra-ui/react';
import theme from '@/styles/theme';
import { ReactNode } from 'react';

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider colorModeManager={cookieStorageManager} theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
