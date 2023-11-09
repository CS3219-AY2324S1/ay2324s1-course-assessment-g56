import { UUID } from 'crypto';
import { QuestionDifficulty } from './question';
import { BasicProfileData } from './profile';

export interface BasicRoomData {
  roomId: UUID;
  user1Id: UUID;
  user2Id: UUID;
  user1QuestionSlug: string;
  user2QuestionSlug: string;
  user1Details: BasicProfileData;
  user2Details: BasicProfileData;
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
