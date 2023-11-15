import axios from 'axios';
import { UUID } from 'crypto';
import initialiseClient from './axios';

export const getRoomDetails = async (roomId: UUID) => {
  const response = await axios.get(`${process.env.ROOM_PATH}/${roomId}`);
  return response.data;
};

export const getPastCollabs = async (access_token: string) => {
  const client = initialiseClient(access_token);
  const response = await client.get(process.env.ROOM_PATH);
  return response.data;
};
