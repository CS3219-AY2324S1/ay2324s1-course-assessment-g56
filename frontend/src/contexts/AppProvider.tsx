'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { CacheProvider } from '@chakra-ui/next-js';
import {
  ChakraProvider,
  StyleFunctionProps,
  cookieStorageManager,
  extendTheme,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Database } from '@/types/database.types';
import {
  createClientComponentClient,
  Session,
} from '@supabase/auth-helpers-nextjs';
import menuTheme from '@/styles/menuTheme';
import SupabaseProvider from './SupabaseProvider';

export default function AppProvider({
  children,
  colorMode,
}: {
  children: ReactNode;
  colorMode: 'light' | 'dark';
}) {
  const [queryClient] = React.useState(() => new QueryClient());
  type MaybeSession = Session | null;
  const [session, setSession] = useState<MaybeSession>(null);
  const supabase = createClientComponentClient<Database>();
  const [sessionFetched, setSessionFetched] = useState(false);

  const fetchSession = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData === null || sessionData.session === null) {
      setSessionFetched(false);
    } else {
      setSession(sessionData.session);
      setSessionFetched(true);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [sessionFetched]);

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
