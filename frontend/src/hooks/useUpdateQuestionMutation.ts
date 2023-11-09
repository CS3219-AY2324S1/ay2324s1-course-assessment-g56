import { QUESTION_LIST_KEY } from '@/constants/queryKey';
import { updateQuestionById } from '@/lib/questions';
import {
  NumberToQuestionDifficultyMap,
  QuestionRowData,
} from '@/types/question';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useUpdateQuestionMutation = (
  slug: string,
  access_token: string,
) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (question: QuestionRowData) =>
      updateQuestionById(question, access_token),
    onMutate: () => {
      queryClient.removeQueries({ queryKey: [QUESTION_LIST_KEY, slug] });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUESTION_LIST_KEY],
        exact: true,
        refetchType: 'all',
      });
      router.push('/home');
      queryClient.setQueryData([QUESTION_LIST_KEY, data.slug!], {
        ...data,
        uuid: data.uuid!,
        slug: data.slug!,
        difficulty: NumberToQuestionDifficultyMap[data.difficulty],
      });
      toast({
        title: 'Question updated.',
        description: "We've updated your question.",
        status: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Something went wrong!',
        description: `We've failed to update your question. ${error.message}`,
        status: 'error',
      });
    },
  });
};
