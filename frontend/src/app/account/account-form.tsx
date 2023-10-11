'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Database } from '@/types/database.types';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';

interface ProfileData {
  fullName: string | null;
  username: string | null;
  website: string | null;
  avatarUrl: string | null;
}

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: null,
    username: null,
    website: null,
    avatarUrl: null,
  });
  const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user!.id)
        .single();

      if (error && status !== 406) {
        throw new Error(error.message);
      }

      if (data) {
        setProfileData({
          fullName: data.full_name,
          username: data.username,
          website: data.website,
          avatarUrl: data.avatar_url,
        });
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  const updateProfile = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: profileData.fullName,
        username: profileData.username,
        website: profileData.website,
        avatar_url: profileData.avatarUrl,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
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
        <Input
          id="fullName"
          type="text"
          value={profileData.fullName || ''}
          onChange={handleInputChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input
          id="username"
          type="text"
          value={profileData.username || ''}
          onChange={handleInputChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="website">Website</FormLabel>
        <Input
          id="website"
          type="url"
          value={profileData.website || ''}
          onChange={handleInputChange}
        />
      </FormControl>

      <Button colorScheme="blue" onClick={updateProfile} isLoading={loading}>
        Update
      </Button>

      <Box>
        <form action="/auth/signout" method="post">
          <Button type="submit">Sign out</Button>
        </form>
      </Box>
    </VStack>
  );
}