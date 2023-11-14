'use client';

import { CellContext } from '@tanstack/react-table';
import { Avatar, HStack, VStack, Text } from '@chakra-ui/react';
import { CollabRowData } from '@/types/collab';

function UserCell({ row }: CellContext<CollabRowData, any>) {
  const profileData = row.original.partner;
  return (
    <HStack>
      <Avatar
        key={`${profileData.username}-${profileData.avatarUrl}`}
        name={profileData.username !== null ? profileData.username : undefined}
        size="sm"
        src={profileData.avatarUrl !== null ? profileData.avatarUrl : undefined}
      />
      <VStack
        display={{ base: 'none', md: 'flex' }}
        alignItems="flex-start"
        spacing="1px"
        ml="2"
      >
        <Text fontSize="sm">{profileData.username}</Text>
      </VStack>
    </HStack>
  );
}

export default UserCell;
