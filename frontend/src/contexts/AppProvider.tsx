'use client';

import React, { ReactNode } from 'react';
import { CacheProvider } from '@chakra-ui/next-js';
import {
  ChakraProvider,
  StyleFunctionProps,
  cookieStorageManager,
  extendTheme,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Session } from '@supabase/auth-helpers-nextjs';
import menuTheme from '@/styles/menuTheme';
import SupabaseProvider from './SupabaseProvider';

type MaybeSession = Session | null;

export default function AppProvider({
  children,
  session,
  colorMode,
}: {
  children: ReactNode;
  session: MaybeSession;
  colorMode: 'light' | 'dark';
}) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 15, // 15 minutes
            enabled: session !== null,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
          },
        },
      }),
  );

  const theme = extendTheme({
    config: {
      initialColorMode: colorMode,
      useSystemColorMode: false,
    },
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          bg: mode('#fff', '#000')(props),
        },
      }),
    },
    components: {
      Menu: menuTheme,
    },
  });

  return (
    <SupabaseProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <ChakraProvider
            colorModeManager={cookieStorageManager}
            theme={theme}
            toastOptions={{
              defaultOptions: {
                duration: 5000,
                isClosable: true,
                position: 'top',
                containerStyle: {
                  marginTop: '15px',
                  marginLeft: { base: 0, md: '15rem' },
                },
              },
            }}
          >
            {children}
          </ChakraProvider>
        </CacheProvider>
      </QueryClientProvider>
    </SupabaseProvider>
  );
}
