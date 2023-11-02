import { useQuery } from '@tanstack/react-query';
import { getQuestionBySlug } from '@/lib/questions';
import {
  QuestionRowData,
  NumberToQuestionDifficultyMap,
} from '@/types/question';
import { QUESTION_LIST_KEY } from '@/constants/queryKey';

export function useQuestionData(slug: string, access_token: string) {
  return useQuery<QuestionRowData | undefined>(
    [QUESTION_LIST_KEY, slug],
    async () => {
      const question = await getQuestionBySlug(slug, access_token);
      return {
        ...question,
        uuid: question.uuid!,
        slug: question.slug!,
        difficulty: NumberToQuestionDifficultyMap[question.difficulty],
      };
    },
    {
      cacheTime: 1000 * 60 * 15, // 15 minutes
      enabled: access_token !== '',
    },
  );
}
