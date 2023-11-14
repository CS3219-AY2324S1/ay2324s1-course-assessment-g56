import { ROOM_QUERY_KEY } from '@/constants/queryKey';
import { useSupabase } from '@/contexts/SupabaseProvider';
import { BasicRoomData } from '@/types/collab';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

type UserQuestionSlugKey = 'user1QuestionSlug' | 'user2QuestionSlug';
type MutationFunctionParams = {
  key: UserQuestionSlugKey;
  questionSlug: string;
};
const userQuestionSlugKeyToColumnNameMap: Record<UserQuestionSlugKey, string> =
  {
    user1QuestionSlug: 'user1_question_slug',
    user2QuestionSlug: 'user2_question_slug',
  };

export const useUpdateRoomQuestionsMutation = (roomId: UUID) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, questionSlug }: MutationFunctionParams) => {
      const { error } = await supabase
        .from('collaborations')
        .update({
          [userQuestionSlugKeyToColumnNameMap[key]]: questionSlug,
        })
        .eq('room_id', roomId);
      if (error) throw new Error(error.message);
      return { key, questionSlug };
    },
    onMutate: async ({ key, questionSlug }: MutationFunctionParams) => {
      await queryClient.cancelQueries({ queryKey: [ROOM_QUERY_KEY] });
      const previousRoomData: BasicRoomData = queryClient.getQueryData([
        ROOM_QUERY_KEY,
      ]);
      queryClient.setQueryData([ROOM_QUERY_KEY], {
        ...previousRoomData,
        [key]: questionSlug,
      });
      return { previousRoomData };
    },
    onError: (_error: Error, _newData, context) => {
      queryClient.setQueryData([ROOM_QUERY_KEY], context?.previousRoomData);
    },
  });
};
