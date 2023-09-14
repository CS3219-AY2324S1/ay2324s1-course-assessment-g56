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
