'use client';

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useSession } from '@/contexts/SupabaseProvider';
import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react';
import { ProfileData } from '@/types/profile';
import AvatarForm from './AvatarForm';

interface OnboardingProfileFormProps {
  profileData: ProfileData;
  setProfileData: Dispatch<SetStateAction<ProfileData>>;
  goToNext: () => void;
}

function OnboardingProfileForm({
  profileData,
  setProfileData,
  goToNext,
}: OnboardingProfileFormProps) {
  const session = useSession();
  const toast = useToast();
  const initialRef = useRef(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateProfile = () => {
    if (!profileData.fullName || !profileData.username) {
      toast({
        title: 'Please fill out all required fields.',
        status: 'error',
      });
      return;
    }
    goToNext();
  };

  return (
    <VStack spacing={4} minW="100%">
      <Flex gap={16} w="100%">
        <VStack spacing={4} w="60%" align="flex-start">
          <FormControl isRequired>
            <FormLabel id="email">Email</FormLabel>
            <Input
              id="email"
              type="text"
              value={session?.user.email}
              isDisabled
            />
          </FormControl>
          <FormControl id="fullName" isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter full name"
              value={profileData.fullName ?? ''}
              ref={initialRef}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={profileData.username ?? ''}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel id="website">Website</FormLabel>
            <Input
              id="website"
              type="url"
              onChange={handleInputChange}
              value={profileData.website ?? ''}
            />
          </FormControl>
        </VStack>
        <VStack align="flex-start">
          <Text fontSize="md" fontWeight="medium">
            Profile Picture
          </Text>
          <AvatarForm
            uid={session?.user.id ?? ''}
            profile={profileData}
            isLoading={false}
          />
        </VStack>
      </Flex>
      <Button
        right={20}
        top={4}
        colorScheme="green"
        alignSelf="flex-end"
        onClick={validateProfile}
      >
        Next Step
      </Button>
    </VStack>
  );
}

export default OnboardingProfileForm;
