import axios from 'axios';

import { QuestionDifficulty } from 'types/question';

export const createRoom = async (user1Id: string, user2Id: string, difficulty: QuestionDifficulty) => {
  const response = await axios.post(
    `${process.env.ROOM_SERVICE_PATH}/create`,
    {
      user1_id: user1Id,
      user2_id: user2Id,
      difficulty,
    },
  );
  return response.data[0];
};
