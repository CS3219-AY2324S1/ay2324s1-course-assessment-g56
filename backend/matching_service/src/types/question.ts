export enum QuestionComplexity {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export const QuestionComplexityToNumberMap: Record<QuestionComplexity, number> =
  Object.freeze({
    [QuestionComplexity.EASY]: 1,
    [QuestionComplexity.MEDIUM]: 2,
    [QuestionComplexity.HARD]: 3,
  });

export const NumberToQuestionComplexityMap: Record<number, QuestionComplexity> =
  Object.freeze({
    1: QuestionComplexity.EASY,
    2: QuestionComplexity.MEDIUM,
    3: QuestionComplexity.HARD,
  });
