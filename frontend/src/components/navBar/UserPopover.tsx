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
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import Link from 'next/link';
import { useUserData } from '@/hooks/useUserData';

function UserPopover() {
  const { data: profileData, isLoading: loading } = useUserData();

  return (
    <Flex alignItems="center">
      <Menu>
        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
          <HStack>
            {loading || profileData === undefined ? (
              <Spinner size="sm" color="blue.500" />
            ) : (
              <>
                <Avatar
                  name={
                    profileData.username !== null
                      ? profileData.username
                      : undefined
                  }
                  size="sm"
                  src={
                    profileData.avatarUrl !== null
                      ? profileData.avatarUrl
                      : undefined // 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
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
              </>
            )}
            <Box display={{ base: 'none', md: 'flex' }}>
              <FiChevronDown />
            </Box>
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem>Profile</MenuItem>
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
