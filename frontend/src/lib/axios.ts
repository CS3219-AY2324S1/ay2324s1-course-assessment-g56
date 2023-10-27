import axios from 'axios';

const initialiseClient = (jwt: string) =>
  axios.create({
    baseURL: process.env.QUESTION_SERVICE,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

export default initialiseClient;
