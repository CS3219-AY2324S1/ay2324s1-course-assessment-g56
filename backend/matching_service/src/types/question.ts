export enum QuestionDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}
export const QuestionDifficultyToNumberMap: Record<QuestionDifficulty, number> =
  Object.freeze({
    [QuestionDifficulty.EASY]: 1,
    [QuestionDifficulty.MEDIUM]: 2,
    [QuestionDifficulty.HARD]: 3,
  });

export const NumberToQuestionDifficultyMap: Record<number, QuestionDifficulty> =
  Object.freeze({
    1: QuestionDifficulty.EASY,
    2: QuestionDifficulty.MEDIUM,
    3: QuestionDifficulty.HARD,
  });
