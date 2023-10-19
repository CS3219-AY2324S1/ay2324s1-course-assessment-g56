import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '@/lib/questions';
import {
  Question,
  QuestionRowData,
  NumberToQuestionComplexityMap,
} from '@/types/question';
import { QUESTION_LIST_KEY } from '@/types/queryKey';

export function useQuestionData() {
  return useQuery<QuestionRowData[] | undefined>(
    [QUESTION_LIST_KEY],
    async () => {
      const questions = await getQuestions();
      const questionList = questions.map((question: Question, idx: number) => {
        const questionId: number = idx + 1;
        return {
          questionId,
          ...question,
          complexity:
            NumberToQuestionComplexityMap[parseInt(question.complexity, 10)],
        };
      });
      return questionList;
    },
  );
}
