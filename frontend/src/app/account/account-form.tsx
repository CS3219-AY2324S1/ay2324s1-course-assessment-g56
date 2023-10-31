'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Skeleton,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Session } from '@supabase/auth-helpers-nextjs';
import { useUserData } from '@/hooks/useUserData';
import { ProfileData } from '@/types/profile';
import AccountDeletionModal from '@/components/modal/AccountDeletionModal';
import { useUpdateUserMutation } from '../../hooks/useUpdateUserMutation';

export default function AccountForm({ session }: { session: Session | null }) {
  const toast = useToast();
  const { data, isLoading, isError } = useUserData();
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: null,
    username: null,
    website: null,
    avatarUrl: null,
    role: 'User',
    updatedAt: null,
  });
  const user = session?.user;

  useEffect(() => {
    if (data) {
      setProfileData(data);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast({
        title: 'An error occurred.',
        description: 'Unable to fetch profile data.',
        status: 'error',
        duration: 9000,
      });
    }
  }, [isError]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateUserMutation = useUpdateUserMutation(user?.id ?? '');

  const updateProfile = async () => {
    updateUserMutation.mutate(profileData);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <VStack spacing={4} className="form-widget">
      <FormControl>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input id="email" type="text" value={session?.user.email} isDisabled />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="fullName">Full Name</FormLabel>
        <Skeleton isLoaded={!isLoading} style={{ borderRadius: '0.375rem' }}>
          <Input
            id="fullName"
            type="text"
            value={profileData.fullName || ''}
            onChange={handleInputChange}
          />
        </Skeleton>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="username">Username</FormLabel>
        <Skeleton isLoaded={!isLoading} style={{ borderRadius: '0.375rem' }}>
          <Input
            id="username"
            type="text"
            value={profileData.username || ''}
            onChange={handleInputChange}
          />
        </Skeleton>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="website">Website</FormLabel>
        <Skeleton isLoaded={!isLoading} style={{ borderRadius: '0.375rem' }}>
          <Input
            id="website"
            type="url"
            value={profileData.website || ''}
            onChange={handleInputChange}
          />
        </Skeleton>
      </FormControl>

      {profileData.updatedAt && (
        <Text fontSize="sm" color="gray.500">
          Updated at: {profileData.updatedAt.toString()}
        </Text>
      )}

      <Button
        colorScheme="blue"
        onClick={updateProfile}
        isLoading={updateUserMutation.isLoading}
        isDisabled={isLoading}
      >
        Update
      </Button>

      <Box>
        <form action="/auth/signout" method="post">
          <Button type="submit" isDisabled={isLoading}>
            Sign out
          </Button>
        </form>
      </Box>

      <Box>
        <Button
          type="submit"
          onClick={onOpen}
          colorScheme="red"
          isDisabled={isLoading}
        >
          Delete Account
        </Button>
        <AccountDeletionModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </VStack>
  );
}
