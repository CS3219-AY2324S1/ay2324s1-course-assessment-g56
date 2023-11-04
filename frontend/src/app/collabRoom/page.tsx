'use client';

// import { Box, VStack } from '@chakra-ui/react';

import CollabRoomRight from '@/components/collabRoom/CollabRoomRight';
import { Language } from '@/types/code';

function Page() {
  // TODO pass it on from the parent component
  const username1 = 'Linus';
  const username2 = 'Cheng Yi';
  const language1 = Language.PYTHON_THREE;
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
