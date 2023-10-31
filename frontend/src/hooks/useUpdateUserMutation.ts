import { USER_QUERY_KEY } from '@/constants/queryKey';
import { Database } from '@/types/database.types';
import { ProfileData } from '@/types/profile';
import { useToast } from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateUserMutation = (userId: string) => {
  const supabase = createClientComponentClient<Database>({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  });
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: ProfileData) => {
      const currDate = new Date();
      const { error } = await supabase.from('profiles').upsert({
        id: userId,
        full_name: profileData.fullName,
        username: profileData.username,
        website: profileData.website,
        avatar_url: profileData.avatarUrl,
        updated_at: currDate.toISOString(),
        role: profileData.role,
      });
      if (error) throw new Error(error.message);
      return profileData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([USER_QUERY_KEY], data);
      toast({
        title: 'Profile updated!',
        description: "We've updated your profile.",
        status: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Something went wrong!',
        description: `We've failed to update your profile. ${error.message}`,
        status: 'error',
      });
    },
  });
};
