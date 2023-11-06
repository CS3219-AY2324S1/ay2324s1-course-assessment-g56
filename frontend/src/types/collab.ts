import { UUID } from "crypto";
import { QuestionDifficulty } from "./question";
import { Language } from "./language";

export interface BasicRoomData {
    roomId: UUID,
    user1Id: UUID,
    user2Id: UUID,
    user1Username: string,
    user2Username: string,
    user1PreferredLanguage: Language,
    user2PreferredLanguage: Language,
    difficulty: QuestionDifficulty,
}