'use client';

import {
  Avatar,
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { Profile } from '@/types/profile';

interface ProfileFormProps {
  changeUsername: (e: ChangeEvent<HTMLInputElement>) => void;
  changeFullName: (e: ChangeEvent<HTMLInputElement>) => void;
  changeAvatarUrl: (e: ChangeEvent<HTMLInputElement>) => void;
  changeWebsite: (e: ChangeEvent<HTMLInputElement>) => void;
  initialValues: Profile;
}

function ProfileForm({
  changeUsername,
  changeFullName,
  changeAvatarUrl,
  changeWebsite,
  initialValues,
}: ProfileFormProps) {
  return (
    <VStack spacing={4} py="10" pb="10">
      <Avatar
        name={initialValues.full_name}
        size="xl"
        src={initialValues.avatar_url}
      />
      <FormControl id="username" isRequired>
        <HStack maxW="90%">
          <Box w="10%">
            <FormLabel pl="4">Username</FormLabel>
          </Box>
          <Input
            type="text"
            placeholder="Enter Name"
            onChange={changeUsername}
            value={initialValues.username}
          />
        </HStack>
      </FormControl>

      <FormControl id="fullname" isRequired>
        <HStack maxW="90%">
          <Box w="10%">
            <FormLabel pl="4">FullName</FormLabel>
          </Box>
          <Input
            type="text"
            placeholder="Enter fullname"
            onChange={changeFullName}
            value={initialValues.full_name}
          />
        </HStack>
      </FormControl>

      <FormControl id="avatarUrl">
        <HStack maxW="90%">
          <Box w="10%">
            <FormLabel pl="4">AvatarUrl</FormLabel>
          </Box>
          <Input
            type="text"
            placeholder="Enter AvatarUrl"
            onChange={changeAvatarUrl}
            value={initialValues.avatar_url}
          />
        </HStack>
      </FormControl>

      <FormControl id="website">
        <HStack maxW="90%">
          <Box w="10%">
            <FormLabel pl="4">Website</FormLabel>
          </Box>
          <Input
            type="text"
            placeholder="Enter Website"
            onChange={changeWebsite}
            value={initialValues.website}
          />
        </HStack>
      </FormControl>
    </VStack>
  );
}

export default ProfileForm;
