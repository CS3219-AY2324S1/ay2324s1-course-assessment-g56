import axios from 'axios';
import 'dotenv/config';

const apiURL = `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_USER_SERVICE_PORT}/profiles`;

export const getProfile = async (id: string) => {
  const params = {
    id,
  };
  try {
    const response = await axios.get(apiURL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};
