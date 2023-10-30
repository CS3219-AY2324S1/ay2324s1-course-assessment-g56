import { QuestionComplexity } from './question';

export interface User {
  uid: string;
  sid: string;
  username: string | null;
  avatarUrl: string | null;
  lowerBoundDifficulty: QuestionComplexity;
  upperBoundDifficulty: QuestionComplexity;
}
