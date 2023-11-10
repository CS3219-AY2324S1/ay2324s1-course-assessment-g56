import { useQuery } from '@tanstack/react-query';
import { ROOM_QUERY_KEY } from '@/constants/queryKey';
import { BasicRoomData } from '@/types/collab';
import { getRoomDetails } from '@/lib/room';
import { NumberToQuestionDifficultyMap } from '@/types/question';
import { UUID } from 'crypto';

export const getRoomData = async (roomId: UUID) => {
  const room = await getRoomDetails(roomId);
  return {
    roomId: room.room_id,
    difficulty: NumberToQuestionDifficultyMap[room.difficulty],
    user1Id: room.user1_id,
    user2Id: room.user2_id,
    user1QuestionSlug: room.user1_question_slug,
    user2QuestionSlug: room.user2_question_slug,
    user1Details: {
      username: room.user1Details.username,
      avatarUrl: room.user1Details.avatar_url,
      preferredInterviewLanguage:
        room.user1Details.preferred_interview_language,
    },
    user2Details: {
      username: room.user2Details.username,
      avatarUrl: room.user2Details.avatar_url,
      preferredInterviewLanguage:
        room.user2Details.preferred_interview_language,
    },
  };
};

export function useRoomData(roomId: UUID) {
  return useQuery<BasicRoomData | undefined>({
    queryKey: [ROOM_QUERY_KEY],
    queryFn: () => getRoomData(roomId),
  });
}
