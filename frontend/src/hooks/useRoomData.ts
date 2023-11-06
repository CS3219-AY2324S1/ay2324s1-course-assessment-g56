import { useQuery } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { ROOM_QUERY_KEY } from '@/constants/queryKey';
import { BasicRoomData } from '@/types/collab';

import axios from 'axios';

const supabase = createClientComponentClient<Database>({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
});

const getRoomData = async (roomId: string) => {
  const roomData = (
    await supabase.from('collaborations').select().eq('room_id', roomId)
  ).data;
  const users = await axios.get(`${process.env.USER_PATH}/users`);

  const user1Data = users.data.filter(
    (user) => user.id === roomData[0].user1_id,
  );

  const user2Data = users.data.filter(
    (user) => user.id === roomData[0].user2_id,
  );
  if (roomData) {
    const response: BasicRoomData = {
      roomId: roomData[0].room_id,
      user1Id: roomData[0].user1_id,
      user2Id: roomData[0].user2_id,
      user1Username: user1Data[0].username,
      user2Username: user2Data[0].username,
      user1PreferredLanguage: user1Data[0].preferred_interview_language,
      user2PreferredLanguage: user2Data[0].preferred_interview_language,
      difficulty: roomData[0].difficulty,
    };
    return response;
  }
  return undefined;
};

export function useRoomData(roomId: string) {
  return useQuery<BasicRoomData | undefined>({
    queryKey: [ROOM_QUERY_KEY],
    queryFn: () => getRoomData(roomId),
  });
}
