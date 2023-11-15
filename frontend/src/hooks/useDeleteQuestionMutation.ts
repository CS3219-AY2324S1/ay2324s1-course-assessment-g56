import { QUESTION_LIST_KEY } from '@/constants/queryKey';
import { deleteQuestionById } from '@/lib/questions';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteQuestionMutation = (access_token: string) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => deleteQuestionById(uuid, access_token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTION_LIST_KEY] });
      toast({
        title: 'Question deleted.',
        description: "We've deleted your question.",
        status: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Something Went Wrong.',
        description: `We've failed to delete your question. ${error.message}`,
        status: 'error',
      });
    },
  });
};
