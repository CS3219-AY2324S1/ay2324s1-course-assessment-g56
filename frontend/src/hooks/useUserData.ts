import { useQuery } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { USER_QUERY_KEY } from '@/types/queryKey';
import { useSession } from '@/contexts/SupabaseProvider';
import { ProfileData } from '@/types/profile';

const supabase = createClientComponentClient<Database>();

const getUserData = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('profiles')
    .select(`full_name, username, website, avatar_url, role`)
    .eq('id', user!.id)
    .single();

  if (data) {
    const profileData: ProfileData = {
      fullName: data.full_name,
      username: data.username,
      website: data.website,
      avatarUrl: data.avatar_url,
      role: data.role,
    };
    return profileData;
  }
  return undefined;
};

export function useUserData() {
  const session = useSession();

  return useQuery<ProfileData | undefined>([USER_QUERY_KEY], getUserData, {
    enabled: session !== null,
  });
}
