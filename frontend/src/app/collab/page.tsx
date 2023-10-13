'use client';

// import VideoCollection from '@/components/video/VideoCollection';
import { Box, Text } from '@chakra-ui/react';
// import { useEffect } from 'react';

import dynamic from 'next/dynamic';

function Page() {
  const VideoCollection = dynamic(
    () => import('@/components/video/VideoCollection'),
    {
      ssr: false,
    },
  );

  return (
    <Box>
      <VideoCollection roomId="TEST" partnerUsername="TEST" />
      {/* <Text>Collab</Text> */}
    </Box>
  );
}

export default Page;
