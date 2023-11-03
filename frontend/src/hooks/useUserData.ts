import { useQuery } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { USER_QUERY_KEY } from '@/constants/queryKey';
import { useSession } from '@/contexts/SupabaseProvider';
import { ProfileData } from '@/types/profile';
import { getUsername } from '@/lib/user';

const supabase = createClientComponentClient<Database>({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
});

const getUserData = async () => {
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
  return undefined;
};

export const checkIfUsernameExists = async (username: string) => {
  const res = await getUsername(username);
  return res;
}

export function useUserData() {
  const session = useSession();

  return useQuery<ProfileData | undefined>([USER_QUERY_KEY], getUserData, {
    enabled: session !== null,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 1000 * 60 * 60, // 1 hour,
  });
}
