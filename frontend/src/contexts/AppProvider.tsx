'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, cookieStorageManager } from '@chakra-ui/react';
import theme from '@/styles/theme';
import { ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

export default function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <CacheProvider>
      <ChakraProvider colorModeManager={cookieStorageManager} theme={theme}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
