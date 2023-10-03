'use client';

import ProfileForm from '@/components/form/ProfileForm';
import { Profile } from '@/types/profile';
import {
  getProfileById,
  deleteProfileById,
  updateProfile,
} from '@/lib/profile';
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Card, Flex, Heading, HStack, VStack } from '@chakra-ui/react';

function Page({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Profile>({
    id: '', // #TODO: Remove once id can be obtain via authetication details
    updated_at: undefined,
    username: '',
    full_name: '',
    avatar_url: '',
    website: '',
  });
  const { id } = params;

  useEffect(() => {
    getProfileById(id)
      .then((info: Profile) => {
        info.avatar_url = info.avatar_url || '';
        info.username = info.username || '';
        info.website = info.website || '';
        info.full_name = info.full_name || '';
        setProfile(info);
      })
      .catch((error) => {
        console.error('Error fetching question:', error);
      });
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  // Handle changes to form fields
  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, username: e.target.value });
  };

  const handleChangeFullName = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, full_name: e.target.value });
  };

  const handleChangeAvatarUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, avatar_url: e.target.value });
  };

  const handleChangeWebsite = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, website: e.target.value });
  };

  const handleSubmit = () => {
    profile.updated_at = new Date(Date.now()).toISOString();
    console.log('profile', profile); // #TODO: To check update works.
    updateProfile(profile);
  };

  const handleDelete = () => {
    deleteProfileById(id);
  };

  return (
    <>
      <Flex>
        <Heading>Profile</Heading>
      </Flex>
      <VStack spacing={4} align="left" justify="center">
        <Card>
          <ProfileForm
            changeUsername={handleChangeUsername}
            changeFullName={handleChangeFullName}
            changeAvatarUrl={handleChangeAvatarUrl}
            changeWebsite={handleChangeWebsite}
            initialValues={profile}
          />
          <HStack spacing={4} justify="center">
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              width="25%"
              alignSelf="center"
            >
              Save Changes
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              width="25%"
              alignSelf="center"
            >
              Delete Account
            </Button>
          </HStack>
        </Card>
      </VStack>
    </>
  );
}

export default Page;
