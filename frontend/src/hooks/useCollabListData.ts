import { useQuery } from '@tanstack/react-query';
import { HISTORY_QUERY_KEY } from '@/constants/queryKey';
import { DatabaseCollab } from '@/types/database.types';
import { getPastCollabs } from '@/lib/room';
import { CollabRowData } from '@/types/collab';
import dayjs from 'dayjs';
import { getAllUsers } from '@/lib/users';

function msToTime(duration: number): string {
  const seconds: number = Math.floor((duration / 1000) % 60);
  const minutes: number = Math.floor((duration / (1000 * 60)) % 60);
  const hours: number = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const hours2: string = hours < 10 ? `0${hours}` : String(hours);
  const minutes2: string = minutes < 10 ? `0${minutes}` : String(minutes);
  const seconds2: string = seconds < 10 ? `0${seconds}` : String(seconds);

  return `${hours2}h ${minutes2}m ${seconds2}s`;
}

export function useCollabListData(user: string) {
  return useQuery<CollabRowData[] | undefined>({
    queryKey: [HISTORY_QUERY_KEY],
    queryFn: async () => {
      const collabs = await getPastCollabs(user);
      const users = await getAllUsers();
      const getUserWithId = (id: string) => users.find((profile) => profile.id === id);
      const collabList = collabs.map(
        (collab: DatabaseCollab) =>
          ({
            collabId: collab.room_id,
            partner:
              collab.user1_id === user
                ? getUserWithId(collab.user2_id) 
                : getUserWithId(collab.user1_id),
            completedTime: dayjs(collab.completed_time).format('MMM DD, YYYY'),
            duration: msToTime(
              dayjs(collab.completed_time).valueOf() -
                dayjs(collab.created_at).valueOf(),
            ),
            language:
              collab.user1_id === user
                ? collab.user1_language
                : collab.user2_language,
          }) as CollabRowData,
      );
      return collabList;
    },
  });
}
