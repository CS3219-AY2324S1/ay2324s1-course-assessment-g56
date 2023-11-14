import axios from 'axios';

export const getAllUsers = async () => {
  const response = await axios.get(`${process.env.USER_PATH}/users`);
  return response.data;
};