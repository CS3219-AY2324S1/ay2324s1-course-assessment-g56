'use client';

// import { Box, VStack } from '@chakra-ui/react';

import CollabRoomRight from '@/components/collabRoom/CollabRoomRight';
import { Language } from '@/types/language';
import { useUserData } from '@/hooks/useUserData';
import SkeletonArray from '@/components/skeleton/SkeletonArray';
import { getRoomDetails } from '@/lib/room';

function Page({ params }: { params: { channelName: string } }) {
  const { data: user, isPending } = useUserData();
  if (isPending) {
    return <SkeletonArray />;
  }
  const roomDetails = await getRoomDetails(params.channelName);
  console.log(roomDetails);
  // TODO pass it on from the parent component
  const username1 = user.username;
  const username2 = 'bryan';
  const language1 = user.preferredInterviewLanguage;
  const language2 = Language.JAVASCRIPT;

  return (
    <CollabRoomRight
      username1={username1}
      username2={username2}
      language1={language1}
      language2={language2}
    />
  );
}

export default Page;
