import axios from 'axios';

const apiURL = `${process.env.USER_SERVICE}/profiles`;

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
