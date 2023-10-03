import { Profile } from '@/types/profile';
import axios from 'axios';

const apiURL = `${process.env.HOST}:${process.env.USER_SERVICE_PORT}/profiles`;

export const getProfileById = async (id: string) => {
  const newApiURL = `${apiURL}/${id}`;
  try {
    const response = await axios.get(newApiURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const deleteProfileById = (id: string) => {
  const body = {
    id,
  };

  axios
    .delete(apiURL, { data: body })
    .then(() => {
      console.log('DELETE request successful');
    })
    .catch((error) => {
      console.error('DELETE request error:', error);
    });
};

// One-indexed id
export const updateProfile = (profile: Profile) => {
  const data = {
    updates: profile,
  };
  axios
    .put(apiURL, data)
    .then(() => {
      console.log('UPDATE request successful');
    })
    .catch((error) => {
      console.error('UPDATE request error:', error);
    });
};
