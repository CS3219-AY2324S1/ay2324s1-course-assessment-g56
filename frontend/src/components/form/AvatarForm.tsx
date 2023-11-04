'use client';

import React, { useMemo, useRef, useState } from 'react';
import { FiEdit, FiUpload } from 'react-icons/fi';
import {
  Button,
  Avatar as ChakraAvatar,
  Divider,
  InputGroup,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { ProfileData } from '@/types/profile';
import { useUpdateUserMutation } from '@/hooks/useUpdateUserMutation';
import { useSupabase } from '@/contexts/SupabaseProvider';

function getInitials(name: string) {
  const names = name.split(' ');
  const firstName = names[0] ?? '';
  const lastName = names.length > 1 ? names[names.length - 1] : '';
  return firstName && lastName
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`
    : firstName.charAt(0);
}

export default function AvatarForm({
  uid,
  profile,
  isLoading,
}: {
  uid: string;
  profile: ProfileData;
  isLoading: boolean;
}) {
  const supabase = useSupabase();
  const toast = useToast();
  const { avatarUrl, username } = profile;
  const initials = useMemo(() => getInitials(username ?? ''), [username]);
  const updateUserMutation = useUpdateUserMutation(uid ?? '');
  const [avatarStatus, setAvatarStatus] = useState('');
  const buttonHoverColor = useColorModeValue('blue.300', 'blue.600');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isOpen, onToggle, onClose } = useDisclosure();

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    onClose();
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    try {
      setAvatarStatus('Uploading...');
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}-${dayjs().format(
        'YYYYMMDD',
      )}-${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      await updateUserMutation.mutateAsync({
        ...profile,
        avatarUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`,
      });
      setAvatarStatus('');
    } catch (error) {
      toast({
        title: 'Error uploading avatar!',
        description: error.message,
        status: 'error',
      });
    }
    event.target.value = null;
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDeleteAvatar = async () => {
    onClose();
    setAvatarStatus('Deleting...');
    await updateUserMutation.mutateAsync({
      ...profile,
      avatarUrl: null,
    });
    setAvatarStatus('');
  };

  const avatar = useMemo(
    () => (
      <ChakraAvatar
        key={`${username}-${avatarUrl}`}
        height={{ base: 100, md: 150, lg: 200 }}
        width={{ base: 100, md: 150, lg: 200 }}
        src={avatarUrl}
        name={username || ''}
      />
    ),
    [avatarUrl, initials],
  );

  return (
    <VStack align="flex-start">
      {avatar}
      <Popover isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button
            leftIcon={avatarUrl ? <FiEdit /> : <FiUpload />}
            mt={{ base: 0, md: -8, lg: -16 }}
            colorScheme="blue"
            isDisabled={isLoading}
            _disabled={{ opacity: 1, cursor: 'not-allowed' }}
            isLoading={avatarStatus !== '' || updateUserMutation.isLoading}
            loadingText={avatarStatus}
            onClick={onToggle}
          >
            {avatarUrl ? 'Edit' : 'Upload'}
          </Button>
        </PopoverTrigger>
        <PopoverContent w={160}>
          <PopoverArrow />
          <PopoverBody p="5px 0 5px 0">
            <InputGroup onClick={handleClick} cursor="pointer" h="28px">
              <input
                type="file"
                multiple={false}
                accept="image/*"
                id="single"
                onChange={uploadAvatar}
                disabled={updateUserMutation.isLoading || isLoading}
                ref={inputRef}
                hidden
              />
              <Text pl="7px" pr="7px" w={160} _hover={{ bg: buttonHoverColor }}>
                Upload a photo...
              </Text>
            </InputGroup>
            {avatarUrl && (
              <>
                <Divider />
                <Text
                  p="2px 7px 0 7px"
                  color="red"
                  h="28px"
                  fontWeight="semibold"
                  _hover={{ bg: buttonHoverColor }}
                  cursor="pointer"
                  onClick={handleDeleteAvatar}
                >
                  Delete
                </Text>
              </>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </VStack>
  );
}
