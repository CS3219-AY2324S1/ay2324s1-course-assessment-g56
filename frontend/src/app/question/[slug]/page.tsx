import EditQuestionForm from '@/components/form/EditQuestionForm';
import QuestionCard from '@/components/card/QuestionCard';
import { getQuestionDataBySlug } from '@/hooks/useQuestionData';
import { Database } from '@/types/database.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { QUESTION_LIST_KEY } from '@/constants/queryKey';

async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = (await supabase.from('profiles').select('role').single()).data;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUESTION_LIST_KEY, slug],
    queryFn: () => getQuestionDataBySlug(slug, session?.access_token ?? ''),
  });

  if (user?.role === 'Maintainer') {
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditQuestionForm
          slug={slug}
          access_token={session?.access_token ?? ''}
        />
      </HydrationBoundary>
    );
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionCard slug={slug} access_token={session?.access_token ?? ''} />
    </HydrationBoundary>
  );
}

export default Page;
