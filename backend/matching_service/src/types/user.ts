import { QuestionComplexity } from './question';

export interface User {
  sid: string;
  lowerBoundDifficulty: QuestionComplexity;
  upperBoundDifficulty: QuestionComplexity;
}
