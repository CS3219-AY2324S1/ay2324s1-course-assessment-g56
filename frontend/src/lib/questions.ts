import { Question, QuestionComplexity } from '@/types/question';
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

export const createQuestion = (question: Question) =>
  getQuestions().then((questions: Question[]) => {
    // Basic error handling to check for duplicates
    const questionTitles: string[] = questions.map((qn: Question) => qn.title);

    if (questionTitles.includes(question.title)) {
      // Reject the promise with an error for duplicates
      return Promise.reject(new Error('Question already exists'));
    }
    // Return a new promise for the POST request
    return axios
      .post(apiURL, question)
      .then((response) => {
        // Success
        console.log('POST request successful:', response.data);
      })
      .catch((error) => {
        // Failure
        console.error('POST request error:', error);
        // Reject the promise with the POST request error
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
export const deleteQuestionById = (uuid: string) => {
  const body = {
    uuid: uuid,
  };

  axios
    .delete(apiURL, { data: body })
    .then(() => {
      // Success
      console.log('DELETE request successful');
    })
    .catch((error) => {
      // Failure
      console.error('DELETE request error:', error);
    });
};

export const testing = () => {
  localStorage.setItem('questions', JSON.stringify([]));
  const sampleQuestion: Question = {
    questionTitle: 'Reverse a String',
    questionDescription: `Write a function that reverses a string. The input string is given as an array 
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
    questionCategories: ['String', 'Algorithms'],
    questionComplexity: QuestionComplexity.EASY,
  };

  createQuestion(sampleQuestion);

  if (
    getQuestions().length !== 1 ||
    JSON.stringify(getQuestions()[0]) !== JSON.stringify(sampleQuestion)
  ) {
    throw new Error('Create question failed');
  }
};
