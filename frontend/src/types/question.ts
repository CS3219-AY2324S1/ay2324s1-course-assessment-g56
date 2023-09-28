export interface Question {
  uuid: string;
  title: string;
  description: string;
  category: string;
  complexity: QuestionComplexity;
  link: string;
}

export enum QuestionComplexity {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}

export const QuestionComplexityNumberToText: { [key: number]: string } = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
};

export const QuestionComplexityToNumberMap: Record<QuestionComplexity, number> =
  Object.freeze({
    [QuestionComplexity.EASY]: 1,
    [QuestionComplexity.MEDIUM]: 2,
    [QuestionComplexity.HARD]: 3,
  });

export interface QuestionRowData {
  questionId: number;
  title: string;
  description: string;
  category: string;
  complexity: QuestionComplexity;
  link: string;
  uuid: string;
}
