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
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

interface ProfileData {
  fullName: string | null;
  username: string | null;
  website: string | null;
  avatarUrl: string | null;
  role: string | 'User';
}

function UserPopover() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: null,
    username: null,
    website: null,
    avatarUrl: null,
    role: 'User',
  });
  useEffect(() => {
    const supabase = createClientComponentClient<Database>();
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data } = await supabase
          .from('profiles')
          .select(`full_name, username, website, avatar_url, role`)
          .eq('id', user!.id)
          .single();

        if (data) {
          setProfileData({
            fullName: data.full_name,
            username: data.username,
            website: data.website,
            avatarUrl: data.avatar_url,
            role: data.role,
          });
        }
      } catch (error) {
        alert('Something Went Wrong');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [profileData]);

  return (
    <Flex alignItems="center">
      <Menu>
        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
          <HStack>
            {loading ? (
              <Spinner size="sm" color="blue.500" />
            ) : (
              <>
                <Avatar
                  name={profileData.username || 'PLACEHOLDER'}
                  size="sm"
                  src={
                    profileData.avatarUrl ||
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
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
