import axios from 'axios';

import { Language } from '@/types/language';

export const tokenUrl = `${process.env.CODE_EXECUTION_PATH}/submissions?base64_encoded=false&wait=true}`;

export const resultUrl = (token) =>
  `${process.env.CODE_EXECUTION_PATH}/submissions/${token}?base64_encoded=false`;

const MAX_ATTEMPTS = 10; // Maximum number of polling attempts
const POLLING_INTERVAL = 2000; // Delay between polling attempts in milliseconds

export const getSubmissionResult = async (token, attempts = 0) => {
  try {
    const response = await axios.get(resultUrl(token));
    const statusId = response.data.status.id;

    if (!(statusId === 1 || statusId === 2)) {
      return response.data;
    }
    if (attempts < MAX_ATTEMPTS) {
      // If the submission is still being processed, wait and then retry
      await new Promise((resolve) => {
        setTimeout(resolve, POLLING_INTERVAL);
      });
      return getSubmissionResult(token, attempts + 1);
    }
    return 'Time Limit Exceeded';
  } catch (error) {
    console.error('Error fetching result:', error);
    throw error;
  }
};

export function formatJudge0Message(result) {
  let message = '';

  if (!result) {
    return 'No code result yet';
  }

  // Check if there's a compile error
  if (result.compile_output) {
    message += `Compile Error:\n${result.compile_output}\n`;
  }

  // Check if there's a runtime error
  if (result.stderr) {
    message += `Runtime Error:\n${result.stderr}\n`;
  }

  // Check if the code executed successfully but there's no output
  if (result.stdout === null && !result.stderr) {
    message += `No output\n`;
  }

  // If there's output, display it
  if (result.stdout) {
    message += `Output:\n${result.stdout}\n`;
  }

  // Add time and memory usage
  message += `Time: ${result.time} seconds\n`;
  message += `Memory: ${result.memory} KB\n`;

  // Add status message
  if (result.status && result.status.description) {
    message += `Status: ${result.status.description}\n`;
  }

  // Add any additional message
  if (result.message) {
    message += `Message: ${result.message}\n`;
  }

  return message.trim();
}

export function getLanguageId(language: Language) {
  switch (language) {
    case Language.PYTHON_THREE:
      return 71;
    case Language.JAVASCRIPT:
      return 63;
    case Language.JAVA:
      return 62;
    default:
      return 71;
  }
}
