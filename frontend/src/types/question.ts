export interface Question {
  uuid?: string;
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

export function QuestionComplexityToDisplayText(complexity: string): string {
  return complexity.charAt(0) + complexity.slice(1).toLowerCase();
}

export interface QuestionRowData {
  questionId: number;
  title: string;
  description: string;
  category: string;
  complexity: QuestionComplexity;
  link: string;
  uuid: string;
}
