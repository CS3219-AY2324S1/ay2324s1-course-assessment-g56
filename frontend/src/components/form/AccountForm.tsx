'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
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
import { Language } from '@/types/language';
import { useUpdateUserMutation } from '../../hooks/useUpdateUserMutation';
import AvatarForm from './AvatarForm';

export default function AccountForm({ session }: { session: Session | null }) {
  const toast = useToast();
  const { data, isPending, isError } = useUserData();
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: null,
    username: null,
    website: null,
    avatarUrl: null,
    preferredInterviewLanguage: null,
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
    if (
      !profileData.fullName ||
      !profileData.username ||
      !profileData.preferredInterviewLanguage
    ) {
      toast({
        title: 'Please fill out all required fields.',
        status: 'error',
      });
      return;
    }
    updateUserMutation.mutate(profileData);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const changeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      preferredInterviewLanguage: value as Language,
    }));
  };

  return (
    <VStack spacing={4} minW="100%">
      <Flex gap={16} w="100%">
        <VStack spacing={4} className="form-widget" w="60%" align="flex-start">
          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="text"
              value={session?.user.email}
              isDisabled
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="fullName">Full Name</FormLabel>
            <Skeleton isLoaded={!isPending} borderRadius="0.375rem">
              <Input
                id="fullName"
                type="text"
                value={profileData.fullName || ''}
                onChange={handleInputChange}
              />
            </Skeleton>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Skeleton isLoaded={!isPending} borderRadius="0.375rem">
              <Input
                id="username"
                type="text"
                value={profileData.username || ''}
                onChange={handleInputChange}
              />
            </Skeleton>
          </FormControl>

          <FormControl isRequired>
            <FormLabel id="preferredInterviewLanguage">
              Preferred Interview Language
            </FormLabel>
            <Skeleton isLoaded={!isPending} borderRadius="0.375rem">
              <Select
                onChange={changeLanguage}
                value={profileData.preferredInterviewLanguage || ''}
                required
              >
                <option value="" disabled hidden>
                  Choose Language
                </option>
                <option value={Language.JAVA}>Java</option>
                <option value={Language.JAVASCRIPT}>Javascript</option>
                <option value={Language.PYTHON_THREE}>Python 3</option>
              </Select>
            </Skeleton>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="website">Website</FormLabel>
            <Skeleton isLoaded={!isPending} borderRadius="0.375rem">
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
        </VStack>
        <VStack align="flex-start">
          <Text fontSize="md" fontWeight="medium">
            Profile Picture
          </Text>
          <AvatarForm
            uid={user?.id ?? ''}
            profile={profileData}
            isLoading={isPending}
          />
        </VStack>
      </Flex>
      <Button
        colorScheme="blue"
        onClick={updateProfile}
        isLoading={updateUserMutation.isPending}
        isDisabled={isPending}
      >
        Update
      </Button>
      <Box>
        <form action="/auth/signout" method="post">
          <Button type="submit" isDisabled={isPending}>
            Sign out
          </Button>
        </form>
      </Box>
      <Box>
        <Button
          type="submit"
          onClick={onOpen}
          colorScheme="red"
          isDisabled={isPending}
        >
          Delete Account
        </Button>
        <AccountDeletionModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </VStack>
  );
}
