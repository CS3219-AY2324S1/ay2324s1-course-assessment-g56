import { useQuery } from '@tanstack/react-query';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { USER_QUERY_KEY } from '@/constants/queryKey';
import { ProfileData } from '@/types/profile';
import { supabaseAnon } from '@/components/supabase/supabase';

const supabaseInstance = supabaseAnon;

export const getUserData = async (supabase: SupabaseClient<Database>) => {
  const { data } = await supabase.from('profiles').select('*').single();

  if (data) {
    const profileData: ProfileData = {
      fullName: data.full_name,
      username: data.username,
      website: data.website,
      avatarUrl: data.avatar_url,
      preferredInterviewLanguage: data.preferred_interview_language,
      role: data.role,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    };
    return profileData;
  }
  throw new Error('Profile not found');
};

export function useUserData() {
  return useQuery<ProfileData | undefined>({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => getUserData(supabaseInstance),
  });
}
