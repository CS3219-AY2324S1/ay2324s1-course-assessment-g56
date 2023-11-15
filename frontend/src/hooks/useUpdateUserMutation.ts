import { USER_QUERY_KEY } from '@/constants/queryKey';
import { useSupabase } from '@/contexts/SupabaseProvider';
import { ProfileData } from '@/types/profile';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateUserMutation = (userId: string) => {
  const supabase = useSupabase();
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
      await queryClient.cancelQueries({ queryKey: [USER_QUERY_KEY] });
      const previousProfileData: ProfileData = queryClient.getQueryData([
        USER_QUERY_KEY,
      ]);
      queryClient.setQueryData([USER_QUERY_KEY], profileData);
      return { previousProfileData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      toast({
        title: 'Profile updated!',
        description: "We've updated your profile.",
        status: 'success',
      });
    },
    onError: (error: Error, _newData, context) => {
      queryClient.setQueryData([USER_QUERY_KEY], context?.previousProfileData);
      if (
        error.message.includes(
          'violates unique constraint "profiles_username_key"',
        )
      ) {
        toast({
          title: 'Username taken!',
          description: 'This username is already taken.',
          status: 'error',
        });
      } else if (
        error.message.includes('violates check constraint "username_length"')
      ) {
        toast({
          title: 'Username too short!',
          description: 'Your username is too short.',
          status: 'error',
        });
      } else {
        toast({
          title: 'Something went wrong!',
          description: `We've failed to update your profile. ${error.message}`,
          status: 'error',
        });
      }
    },
  });
};
