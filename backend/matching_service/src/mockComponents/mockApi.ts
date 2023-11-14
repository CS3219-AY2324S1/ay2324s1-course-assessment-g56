import { QuestionDifficulty } from 'types/question';

export const createMockRoom = async (
  user1Id: string,
  user2Id: string,
  difficulty: QuestionDifficulty,
) => {
  console.log(
    `Creating Mock Room, user1Id: ${user1Id}, user2Id:${user2Id}, difficulty:${difficulty}`,
  );
  const mockResponse = {
    room_id: 'TEST ROOM',
  };
  return mockResponse;
};
