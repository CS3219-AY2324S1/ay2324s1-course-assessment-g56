import axios from 'axios';

export const getRoomDetails = async (roomId: string) => {
  const response = await axios.get(`${process.env.ROOM_PATH}/${roomId}`);
  return response.data;
};
