'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, cookieStorageManager } from '@chakra-ui/react';
import theme from '@/styles/theme';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Database } from '@/types/database.types';
import {
  createClientComponentClient,
  Session,
} from '@supabase/auth-helpers-nextjs';
import SupabaseProvider from './SupabaseProvider';

export default function AppProvider({ children }: { children: ReactNode }) {
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

  return (
    <SupabaseProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <ChakraProvider colorModeManager={cookieStorageManager} theme={theme}>
            {children}
          </ChakraProvider>
        </CacheProvider>
      </QueryClientProvider>
    </SupabaseProvider>
  );
}
