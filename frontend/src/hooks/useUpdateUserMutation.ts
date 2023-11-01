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
        preferred_interview_language: profileData.preferredInterviewLanguage,
        updated_at: currDate.toISOString(),
        role: profileData.role,
      });
      if (error) throw new Error(error.message);
      return profileData;
    },
    onMutate: async (profileData: ProfileData) => {
      await queryClient.cancelQueries([USER_QUERY_KEY]);
      const previousProfileData: ProfileData = queryClient.getQueryData([
        USER_QUERY_KEY,
      ]);
      queryClient.setQueryData([USER_QUERY_KEY], profileData);
      return { previousProfileData };
    },
    onSuccess: () => {
      toast({
        title: 'Profile updated!',
        description: "We've updated your profile.",
        status: 'success',
      });
    },
    onError: (error: Error, _newData, context) => {
      queryClient.setQueryData([USER_QUERY_KEY], context?.previousProfileData);
      toast({
        title: 'Something went wrong!',
        description: `We've failed to update your profile. ${error.message}`,
        status: 'error',
      });
    },
  });
};
