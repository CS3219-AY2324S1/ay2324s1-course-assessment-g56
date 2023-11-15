'use client';

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { Session, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { supabaseAnon } from '@/components/supabase/supabase';

type MaybeSession = Session | null;

type SupabaseContext = {
  supabase: SupabaseClient<any, string>;
  session: MaybeSession;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: MaybeSession;
}) {
  const supabase = supabaseAnon;
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, _session) => {
      if (_session?.access_token !== session?.access_token) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, session]);

  const contextValue = useMemo(
    () => ({ supabase, session }),
    [supabase, session],
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export const useSupabase = <
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
>() => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context.supabase as SupabaseClient<Database, SchemaName>;
};

export const useSession = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSession must be used inside SupabaseProvider');
  }

  return context.session;
};
