'use client';

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  MouseEvent,
} from 'react';
import { Database } from '@/types/database.types';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Skeleton,
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
  role: string | 'User';
}

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: null,
    username: null,
    website: null,
    avatarUrl: null,
    role: 'User',
  });
  const user = session?.user;

  const handleDelete = (e: MouseEvent) => {
    if (!user) {
      alert('You must be logged in to delete your account!');
      return;
    }

    const userConfirmed = window.confirm(
      'Are you sure you want to delete your account?',
    );
    if (!userConfirmed) {
      e.preventDefault(); // Prevent the form from submitting
    }
  };

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url, role`)
        .eq('id', user!.id)
        .single();

      if (error && status !== 406) {
        throw new Error(error.message);
      }

      if (!data) {
        alert('User not found!');
        return;
      }
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
      setUpdating(true);

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: profileData.fullName,
        username: profileData.username,
        website: profileData.website,
        avatar_url: profileData.avatarUrl,
        updated_at: new Date().toISOString(),
        role: profileData.role,
      });
      if (error) throw new Error(error.message);
      alert('Profile updated!');
    } catch (error) {
      alert(`Error updating the data! ${error.message}`);
    } finally {
      setUpdating(false);
    }
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
        <Skeleton isLoaded={!loading} style={{ borderRadius: '0.375rem' }}>
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
        <Skeleton isLoaded={!loading} style={{ borderRadius: '0.375rem' }}>
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
        <Skeleton isLoaded={!loading} style={{ borderRadius: '0.375rem' }}>
          <Input
            id="website"
            type="url"
            value={profileData.website || ''}
            onChange={handleInputChange}
          />
        </Skeleton>
      </FormControl>

      <Button
        colorScheme="blue"
        onClick={updateProfile}
        isLoading={updating}
        isDisabled={loading}
      >
        Update
      </Button>

      <Box>
        <form action="/auth/signout" method="post">
          <Button type="submit">Sign out</Button>
        </form>
      </Box>

      <Box>
        <form action="/auth/delete" method="post">
          <input type="hidden" name="userId" value={user?.id} />

          <Button type="submit" onClick={handleDelete} colorScheme="red">
            Delete Account
          </Button>
        </form>
      </Box>
    </VStack>
  );
}
