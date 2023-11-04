import { QUESTION_LIST_KEY } from '@/constants/queryKey';
import { createQuestion } from '@/lib/questions';
import { Question } from '@/types/question';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateQuestionMutation = (
  onClose: () => void,
  access_token: string,
) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (question: Question) => createQuestion(question, access_token),
    onSuccess: () => {
      toast({
        title: 'Question added.',
        description: "We've added your question.",
        status: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Something Went Wrong.',
        description: `We've failed to add your question. ${error.message}`,
        status: 'error',
      });
    },
    onSettled: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: [QUESTION_LIST_KEY] });
    },
  });
};
