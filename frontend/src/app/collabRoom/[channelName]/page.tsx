import CollabRoomLeft from '@/components/collabRoom/CollabRoomLeft';
import CollabRoomRight from '@/components/collabRoom/CollabRoomRight';
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

async function Page({ params }: { params: { channelName: string } }) {
  const { channelName } = params;
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HStack align="flex-start">
        <CollabRoomLeft roomId={channelName} />
        <CollabRoomRight roomId={channelName} user={user} />
      </HStack>
    </HydrationBoundary>
  );
}

export default Page;
