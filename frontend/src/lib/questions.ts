import { DatabaseQuestion } from '@/types/database.types';
import {
  Question,
  QuestionComplexity,
  QuestionComplexityToNumberMap,
} from '@/types/question';
import axios from 'axios';

const apiURL = `${process.env.HOST}:${process.env.QUESTION_SERVICE_PORT}/questions`;

export const getQuestions = async () => {
  try {
    const response = await axios.get(apiURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

function convertQuestionToDatabaseQuestion(question: Question) {
  return {
    uuid: question.uuid,
    title: question.title,
    description: question.description,
    category: question.category,
    complexity: QuestionComplexityToNumberMap[question.complexity],
    link: question.link,
  };
}

export const createQuestion = (question: Question) =>
  getQuestions().then((questions: Question[]) => {
    // Basic error handling to check for duplicates
    const questionTitles: string[] = questions.map((qn: Question) => qn.title);

    if (questionTitles.includes(question.title)) {
      return Promise.reject(new Error('Question already exists'));
    }
    const questionForDb: DatabaseQuestion =
      convertQuestionToDatabaseQuestion(question);

    return axios
      .post(apiURL, questionForDb)
      .then((response) => {
        console.log('POST request successful:', response.data);
        questionForDb.uuid = response.data.uuid;
        return questionForDb;
      })
      .catch((error) => {
        console.error('POST request error:', error);
        return Promise.reject(error);
      });
  });

// One-indexed id
export const getQuestionById = async (uuid: string) => {
  const newApiURL = `${apiURL}/getById/${uuid}`;
  try {
    const response = await axios.get(newApiURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// One-indexed id
export const deleteQuestionById = async (uuid: string) => {
  const body = {
    uuid,
  };

  try {
    await axios.delete(apiURL, { data: body });
    console.log('DELETE request successful');
  } catch (error) {
    console.error('DELETE request error:', error);
  }
};

export const updateQuestionById = (question: Question) =>
  getQuestions().then((questions: Question[]) => {
    const existingQuestionWithSameTitle: Question | undefined = questions.find(
      (qn: Question) =>
        qn.title === question.title && qn.uuid !== question.uuid,
    );

    if (existingQuestionWithSameTitle) {
      return Promise.reject(new Error('Question already exists'));
    }

    const questionForDb = convertQuestionToDatabaseQuestion(question);

    return axios
      .put(apiURL, questionForDb)
      .then(() => {
        console.log('PUT request successful');
        return question;
      })
      .catch((error) => {
        console.error('PUT request error:', error);
        return Promise.reject(error);
      });
  });

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

  createQuestion(sampleQuestion);

  getQuestions()
    .then((questions: Question[]) => {
      if (questions.length !== 1 || questions[0] !== sampleQuestion) {
        throw new Error('Create question failed');
      }
    })
    .catch((error) => {
      throw error;
    });
};
