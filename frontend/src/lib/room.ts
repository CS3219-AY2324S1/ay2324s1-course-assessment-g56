import axios from 'axios';

export const getRoomDetails = async (roomId: string) => {
  const response = await axios.get(
    `${process.env.ROOM_PATH}/?room_id=${roomId}`,
  );
  return response.data;
};
