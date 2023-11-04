import { useQuery } from '@tanstack/react-query';
import { getQuestionBySlug } from '@/lib/questions';
import {
  QuestionRowData,
  NumberToQuestionDifficultyMap,
} from '@/types/question';
import { QUESTION_LIST_KEY } from '@/constants/queryKey';

export function useQuestionData(slug: string, access_token: string) {
  return useQuery<QuestionRowData | undefined>({
    queryKey: [QUESTION_LIST_KEY, slug],
    queryFn: async () => {
      const question = await getQuestionBySlug(slug, access_token);
      return {
        ...question,
        uuid: question.uuid!,
        slug: question.slug!,
        difficulty: NumberToQuestionDifficultyMap[question.difficulty],
      };
    },
  });
}
