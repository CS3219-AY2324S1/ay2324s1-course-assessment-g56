import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '@/lib/questions';
import {
  QuestionRowData,
  NumberToQuestionComplexityMap,
} from '@/types/question';
import { QUESTION_LIST_KEY } from '@/constants/queryKey';
import { DatabaseQuestion } from '@/types/database.types';

export function useQuestionListData(access_token: string) {
  return useQuery<QuestionRowData[] | undefined>(
    [QUESTION_LIST_KEY],
    async () => {
      const questions = await getQuestions(access_token);
      const questionList = questions.map(
        (question: DatabaseQuestion) =>
          ({
            ...question,
            complexity: NumberToQuestionComplexityMap[question.complexity],
          }) as QuestionRowData,
      );
      return questionList;
    },
    {
      cacheTime: 1000 * 60 * 30, // 30 minutes
      enabled: access_token !== '',
    },
  );
}
