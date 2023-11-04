import { QuestionDifficulty } from './question';

export interface User {
  uid: string;
  sid: string;
  username: string | null;
  avatarUrl: string | null;
  lowerBoundDifficulty: QuestionDifficulty;
  upperBoundDifficulty: QuestionDifficulty;
}
