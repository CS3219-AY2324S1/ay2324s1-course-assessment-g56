import { ROOM_QUERY_KEY } from '@/constants/queryKey';
import { useSupabase } from '@/contexts/SupabaseProvider';
import { BasicRoomData } from '@/types/collab';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

type UserKey = 'user1' | 'user2';

type QuestionMutationFunctionParams = {
  key: UserKey;
  questionSlug: string;
};

type NotesMutationFunctionParams = {
  key: UserKey;
  notes: string;
};

const userKeyToQuestionSlugColumnNameMap: Record<UserKey, string> = {
  user1: 'user1_question_slug',
  user2: 'user2_question_slug',
};

const userKeyToNotesColumnNameMap: Record<UserKey, string> = {
  user1: 'user1_notes',
  user2: 'user2_notes',
};

export const useUpdateRoomQuestionsMutation = (roomId: UUID) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      key,
      questionSlug,
    }: QuestionMutationFunctionParams) => {
      const { error } = await supabase
        .from('collaborations')
        .update({
          [userKeyToQuestionSlugColumnNameMap[key]]: questionSlug,
        })
        .eq('room_id', roomId);
      if (error) throw new Error(error.message);
      return { key, questionSlug };
    },
    onMutate: async ({ key, questionSlug }: QuestionMutationFunctionParams) => {
      await queryClient.cancelQueries({ queryKey: [ROOM_QUERY_KEY] });
      const previousRoomData: BasicRoomData = queryClient.getQueryData([
        ROOM_QUERY_KEY,
      ]);
      queryClient.setQueryData([ROOM_QUERY_KEY], {
        ...previousRoomData,
        [`${key}QuestionSlug`]: questionSlug,
      });
      return { previousRoomData };
    },
    onError: (_error: Error, _newData, context) => {
      queryClient.setQueryData([ROOM_QUERY_KEY], context?.previousRoomData);
    },
  });
};

export const useUpdateRoomNotesMutation = (roomId: UUID) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, notes }: NotesMutationFunctionParams) => {
      const { error } = await supabase
        .from('collaborations')
        .update({
          [userKeyToNotesColumnNameMap[key]]: notes,
        })
        .eq('room_id', roomId);
      if (error) throw new Error(error.message);
      return { key, notes };
    },
    onMutate: async ({ key, notes }: NotesMutationFunctionParams) => {
      await queryClient.cancelQueries({ queryKey: [ROOM_QUERY_KEY] });
      const previousRoomData: BasicRoomData = queryClient.getQueryData([
        ROOM_QUERY_KEY,
      ]);
      queryClient.setQueryData([ROOM_QUERY_KEY], {
        ...previousRoomData,
        [`${key}Notes`]: notes,
      });
      return { previousRoomData };
    },
    onError: (_error: Error, _newData, context) => {
      queryClient.setQueryData([ROOM_QUERY_KEY], context?.previousRoomData);
    },
  });
};
