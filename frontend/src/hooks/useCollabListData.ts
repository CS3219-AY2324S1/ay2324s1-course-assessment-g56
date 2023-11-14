import { useQuery } from '@tanstack/react-query';
import { HISTORY_QUERY_KEY } from '@/constants/queryKey';
import { getPastCollabs } from '@/lib/room';
import { CollabRowData } from '@/types/collab';

export function useCollabListData(access_token: string) {
  return useQuery<CollabRowData[] | undefined>({
    queryKey: [HISTORY_QUERY_KEY],
    queryFn: async () => {
      const collabs = await getPastCollabs(access_token);
      return collabs;
    },
  });
}
