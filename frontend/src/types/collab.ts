import { UUID } from 'crypto';
import { QuestionDifficulty } from './question';
import { Language } from './language';

export interface BasicRoomData {
  roomId: UUID;
  user1Id: UUID;
  user2Id: UUID;
  user1Username: string;
  user2Username: string;
  user1PreferredLanguage: Language;
  user2PreferredLanguage: Language;
  difficulty: QuestionDifficulty;
}

export interface FullRoomData extends BasicRoomData {
  user1_notes: JSON;
  user2_notes: JSON;
  user1_code: JSON;
  user2_code: JSON;
  user1_qns_id: UUID;
  user2_qns_id: UUID;
  // Will be automatically updated by sql trigger
  completed_time: Date;
}
