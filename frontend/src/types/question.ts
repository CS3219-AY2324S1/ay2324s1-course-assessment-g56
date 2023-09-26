export interface Question {
  questionTitle: string;
  questionDescription: string;
  questionCategories: string[];
  questionComplexity: QuestionComplexity;
}

export enum QuestionComplexity {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export const QuestionComplexityToNumberMap: Record<QuestionComplexity, number> =
  Object.freeze({
    [QuestionComplexity.EASY]: 1,
    [QuestionComplexity.MEDIUM]: 2,
    [QuestionComplexity.HARD]: 3,
  });

export interface QuestionRowData {
  questionId: number;
  questionTitle: string;
  questionDescription: string;
  questionCategories: string[];
  questionComplexity: QuestionComplexity;
}
