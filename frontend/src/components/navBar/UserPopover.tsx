'use client';

import {
  Avatar,
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import Link from 'next/link';
import { ProfileData } from '@/types/profile';
import { useMemo } from 'react';

type Props = {
  profileData: ProfileData;
};

function UserPopover(props: Props) {
  const { profileData } = props;
  const avatar = useMemo(
    () => (
      <Avatar
        key={`${profileData.username}-${profileData.avatarUrl}`}
        name={profileData.username !== null ? profileData.username : undefined}
        size="sm"
        src={profileData.avatarUrl !== null ? profileData.avatarUrl : undefined}
      />
    ),
    [profileData?.avatarUrl, profileData?.username],
  );

  return (
    <Flex alignItems="center">
      <Menu>
        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
          <HStack>
            {avatar}
            <VStack
              display={{ base: 'none', md: 'flex' }}
              alignItems="flex-start"
              spacing="1px"
              ml="2"
            >
              <Text fontSize="sm">{profileData.username}</Text>
              <Text fontSize="xs" color="gray.600">
                {profileData.role}
              </Text>
            </VStack>
            <Box display={{ base: 'none', md: 'flex' }}>
              <FiChevronDown />
            </Box>
          </HStack>
        </MenuButton>
        <MenuList>
          <Link href="/account">
            <MenuItem>Settings</MenuItem>
          </Link>
          <MenuDivider />
          <form action="/auth/signout" method="post">
            <MenuItem type="submit">Sign out</MenuItem>
          </form>
        </MenuList>
      </Menu>
    </Flex>
  );
}

export default UserPopover;
