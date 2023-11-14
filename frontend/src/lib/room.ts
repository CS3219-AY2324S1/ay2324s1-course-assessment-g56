import axios from 'axios';
import { UUID } from 'crypto';

export const getRoomDetails = async (roomId: UUID) => {
  const response = await axios.get(`${process.env.ROOM_PATH}/${roomId}`);
  return response.data;
};

export const getPastCollabs = async (user: string) => {
  const response = await axios.get(`${process.env.ROOM_PATH}/?user=${user}`);
  return response.data;
}
