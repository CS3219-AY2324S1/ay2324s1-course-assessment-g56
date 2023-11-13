import { ROOM_QUERY_KEY } from '@/constants/queryKey';
import { useSupabase } from '@/contexts/SupabaseProvider';
import { Language } from '@/types/language';
import { BasicRoomData } from '@/types/collab';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

type UserKey = 'user1' | 'user2';

type MutationFunctionParams = {
  key: UserKey;
  languageSlug: Language;
  result: JSON;
};

const userLanguageSlugKeyToColumnNameMap: Record<UserKey, string> = {
  user1: 'user1_language',
  user2: 'user2_language  ',
};

const userResultKeyToColumnNameMap: Record<UserKey, string> = {
  user1: 'user1_result',
  user2: 'user2_result',
};

const supabase = useSupabase();
const queryClient = useQueryClient();

export const useUpdateCodeResultMutation = (roomId: UUID) => {
  console.log(`updating code result for room: ${roomId} `);
  return useMutation({
    mutationFn: async ({ key, result }: MutationFunctionParams) => {
      const { error } = await supabase
        .from('collaborations')
        .update({
          [userResultKeyToColumnNameMap[key]]: result,
        })
        .eq('room_id', roomId);
      if (error) throw new Error(error.message);
      return { key, result };
    },
    onMutate: async ({ key, result }: MutationFunctionParams) => {
      await queryClient.cancelQueries({ queryKey: [ROOM_QUERY_KEY] });
      const previousRoomData: BasicRoomData = queryClient.getQueryData([
        ROOM_QUERY_KEY,
      ]);
      queryClient.setQueryData([ROOM_QUERY_KEY], {
        ...previousRoomData,
        [key]: result,
      });
      return { previousRoomData };
    },
    onError: (_error: Error, _newData, context) => {
      queryClient.setQueryData([ROOM_QUERY_KEY], context?.previousRoomData);
    },
  });
};

export const useUpdateRoomCloseMutation = (roomId: UUID) => {
  console.log(`closing room: ${roomId} `);
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('collaborations')
        .update({
          is_closed: true,
        })
        .eq('room_id', roomId);
      if (error) throw new Error(error.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [ROOM_QUERY_KEY] });
      const previousRoomData: BasicRoomData = queryClient.getQueryData([
        ROOM_QUERY_KEY,
      ]);
      queryClient.setQueryData([ROOM_QUERY_KEY], {
        ...previousRoomData,
        isClosed: true,
      });
      return { previousRoomData };
    },
    onError: (_error: Error, _newData, context) => {
      queryClient.setQueryData([ROOM_QUERY_KEY], context?.previousRoomData);
    },
  });
};

export const useUpdateRoomLanguagesMutation = (roomId: UUID) => {
  console.log(`updating language for room: ${roomId} `);
  return useMutation({
    mutationFn: async ({ key, languageSlug }: MutationFunctionParams) => {
      const { error } = await supabase
        .from('collaborations')
        .update({
          [userLanguageSlugKeyToColumnNameMap[key]]: languageSlug,
        })
        .eq('room_id', roomId);
      if (error) throw new Error(error.message);
      return { key, languageSlug };
    },
    onMutate: async ({ key, languageSlug }: MutationFunctionParams) => {
      await queryClient.cancelQueries({ queryKey: [ROOM_QUERY_KEY] });
      const previousRoomData: BasicRoomData = queryClient.getQueryData([
        ROOM_QUERY_KEY,
      ]);
      queryClient.setQueryData([ROOM_QUERY_KEY], {
        ...previousRoomData,
        [key]: languageSlug,
      });
      return { previousRoomData };
    },
    onError: (_error: Error, _newData, context) => {
      queryClient.setQueryData([ROOM_QUERY_KEY], context?.previousRoomData);
    },
  });
};
