import axios from 'axios';

const apiUrl = `${process.env.VIDEO_PATH}/access_token`;

interface VideoToken {
    token: string;
}

export const getVideoAccessToken = async (
  channelName: string,
): Promise<VideoToken> => {
  try {
    const response = axios.get(apiUrl, {
      params: {
        channelName,
      },
    });
    return (await response).data;
  } catch (error) {
    console.error('Error retrieving video access token:', error);
    throw error;
  }
};
