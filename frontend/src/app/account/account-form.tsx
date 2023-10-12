'use client';

import { useCallback, useEffect, useState } from 'react';
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

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const user = session?.user;

  const handleDelete = (e) => {
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
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw new Error(error);
      }

      if (!data) {
        alert('User not found!');
        return;
      }
      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
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

  async function updateProfile({
    username: user_name,
    website: website_,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username: user_name,
        website: website_,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error);
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

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
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="website">Website</FormLabel>
        <Input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        onClick={() =>
          updateProfile({
            fullname,
            username,
            website,
            avatar_url: avatarUrl,
          })
        }
        isLoading={loading}
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
