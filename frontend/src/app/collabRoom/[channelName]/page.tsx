'use client';

import CollabRoomRight from '@/components/collabRoom/CollabRoomRight';

function Page({ params }: { params: { channelName: string } }) {
  return (
    <CollabRoomRight
      roomId={params.channelName}
    />
  );
}

export default Page;
