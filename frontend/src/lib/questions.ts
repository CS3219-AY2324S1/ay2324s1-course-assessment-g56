import { DatabaseQuestion } from '@/types/database.types';
import {
  Question,
  QuestionComplexity,
  QuestionComplexityToNumberMap,
  QuestionRowData,
} from '@/types/question';
import initialiseClient from './axios';

const apiUrl = `${process.env.QUESTION_PATH}/questions`;
const adminApiUrl = `${process.env.QUESTION_PATH}/admin/questions`;

export const getQuestions = async (
  access_token: string,
): Promise<DatabaseQuestion[]> => {
  const client = initialiseClient(access_token);
  try {
    const response = await client.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

const convertQuestionToDatabaseQuestion = (question: Question) => ({
  ...question,
  complexity: QuestionComplexityToNumberMap[question.complexity],
});

export const createQuestion = (
  question: Question,
  access_token: string,
): Promise<DatabaseQuestion> => {
  const questionForDb: DatabaseQuestion =
    convertQuestionToDatabaseQuestion(question);

  const client = initialiseClient(access_token);

  return client
    .post(adminApiUrl, questionForDb)
    .then((response) => {
      console.log('POST request successful:', response.data);
      return response.data;
    })
    .catch((error) => {
      throw new Error(error.response.data.error);
    });
};

export const getQuestionBySlug = async (
  slug: string,
  access_token: string,
): Promise<DatabaseQuestion> => {
  const newApiURL = `${apiUrl}/${slug}`;
  const client = initialiseClient(access_token);
  try {
    const response = await client.get(newApiURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
};

export const deleteQuestionById = async (
  uuid: string,
  access_token: string,
) => {
  const newApiURL = `${adminApiUrl}/${uuid}`;
  const client = initialiseClient(access_token);

  try {
    await client.delete(newApiURL);
    console.log('DELETE request successful');
  } catch (error) {
    console.error('DELETE request error:', error);
  }
};

export const updateQuestionById = (
  question: QuestionRowData,
  access_token: string,
): Promise<DatabaseQuestion> => {
  const newApiURL = `${adminApiUrl}/${question!.uuid}`;
  const questionForDb = convertQuestionToDatabaseQuestion(question);

  const client = initialiseClient(access_token);

  return client
    .put(newApiURL, questionForDb)
    .then((response) => {
      console.log('PUT request successful');
      return response.data;
    })
    .catch((error) => {
      throw new Error(error.response.data.error);
    });
};

export const testing = () => {
  localStorage.setItem('questions', JSON.stringify([]));
  const sampleQuestion: Question = {
    title: 'Reverse a String',
    description: `Write a function that reverses a string. The input string is given as an array 
      of characters s. 
      
      You must do this by modifying the input array in-place with O(1) extra 
      memory. 
      
      
      Example 1: 
      
      Input: s = ["h","e","l","l","o"] 
      Output: ["o","l","l","e","h"] 
      Example 2: 
      
      Input: s = ["H","a","n","n","a","h"] 
      Output: ["h","a","n","n","a","H"] 
      
      Constraints: 
      
      1 <= s.length <= 105
      s[i] is a printable ascii character`,
    category: 'String, Algorithms',
    complexity: QuestionComplexity.EASY,
    link: 'example.com/101',
  };

  createQuestion(sampleQuestion, '').then((question) => {
    getQuestions('')
      .then((questions: DatabaseQuestion[]) => {
        if (questions.length !== 1 || questions[0] !== question) {
          throw new Error('Create question failed');
        }
      })
      .catch((error) => {
        throw error;
      });
  });
};
