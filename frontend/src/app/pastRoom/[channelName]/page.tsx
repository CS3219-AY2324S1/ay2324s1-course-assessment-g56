import {
  QUESTION_LIST_KEY,
  ROOM_QUERY_KEY,
  USER_QUERY_KEY,
} from '@/constants/queryKey';
import { getQuestionDataBySlug } from '@/hooks/useQuestionData';
import { getRoomData } from '@/hooks/useRoomData';
import { getUserData } from '@/hooks/useUserData';
import { BasicRoomData } from '@/types/collab';
import { Database } from '@/types/database.types';
import { ProfileData } from '@/types/profile';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { HStack } from '@chakra-ui/react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { UUID } from 'crypto';
import dynamic from 'next/dynamic';

import PastRoomRight from '@/components/pastRoom/PastRoomRight';
import PastRoomLeft from '@/components/pastRoom/PastRoomLeft';

const ErrorBoundary = dynamic(
  () => import('@/components/errorBoundary/ErrorBoundary'),
  { ssr: false }, // Disable server-side rendering for this component
);

async function Page({ params }: { params: { channelName: string } }) {
  const { channelName } = params as { channelName: UUID };
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

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => getUserData(supabase),
  });

  await queryClient.prefetchQuery({
    queryKey: [ROOM_QUERY_KEY],
    queryFn: () => getRoomData(channelName),
  });

  const roomData: BasicRoomData = queryClient.getQueryData([ROOM_QUERY_KEY]);
  const user: ProfileData = queryClient.getQueryData([USER_QUERY_KEY]);

  await queryClient.prefetchQuery({
    queryKey: [QUESTION_LIST_KEY, roomData?.user1QuestionSlug],
    queryFn: () =>
      getQuestionDataBySlug(
        roomData?.user1QuestionSlug,
        session?.access_token ?? '',
      ),
  });

  await queryClient.prefetchQuery({
    queryKey: [QUESTION_LIST_KEY, roomData?.user2QuestionSlug],
    queryFn: () =>
      getQuestionDataBySlug(
        roomData?.user2QuestionSlug,
        session?.access_token ?? '',
      ),
  });

  return (
    <ErrorBoundary>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HStack align="flex-start">
          <PastRoomLeft roomId={channelName} username={user.username} />
          <PastRoomRight roomId={channelName} user={user} />
        </HStack>
      </HydrationBoundary>
    </ErrorBoundary>
  );
}

export default Page;
