import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '@/lib/questions';
import {
  QuestionRowData,
  NumberToQuestionDifficultyMap,
} from '@/types/question';
import { QUESTION_LIST_KEY } from '@/constants/queryKey';
import { DatabaseQuestion } from '@/types/database.types';

export function useQuestionListData(access_token: string) {
  return useQuery<QuestionRowData[] | undefined>({
    queryKey: [QUESTION_LIST_KEY],
    queryFn: async () => {
      const questions = await getQuestions(access_token);
      const questionList = questions.map(
        (question: DatabaseQuestion) =>
          ({
            ...question,
            difficulty: NumberToQuestionDifficultyMap[question.difficulty],
          }) as QuestionRowData,
      );
      return questionList;
    },
  });
}
