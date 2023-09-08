import { Question, QuestionComplexity } from '../types/question';

export const getQuestions = () => {
  if (!localStorage.getItem('questions')) {
    throw new Error('No questions found');
  }
  const questions = JSON.parse(localStorage.getItem('questions')!);
  return questions;
};

export const createQuestion = (question: Question) => {
  const questions: Question[] = getQuestions();
  if (questions.length === 0) {
    const id = 1;
    question.questionId = id;
    questions[id] = question;
    localStorage.setItem('questions', JSON.stringify(questions));
    return;
  }
  // basic error handling to check for duplicates
  const questionTitles: string[] = questions.map(
    (qn: Question) => qn.questionTitle,
  );
  if (questionTitles.includes(question.questionTitle)) {
    throw new Error('Question already exists');
  }
  const id: number = questions.length + 1; // sets id to the next available id
  question.questionId = id;
  questions[id] = question;
  localStorage.setItem('questions', JSON.stringify(questions));
};

export const getQuestionById = (id: number) => {
  const questions: Question[] = getQuestions();
  return questions[id];
};

export const deleteQuestionById = (id: number) => {
  const questions: Question[] = getQuestions();
  delete questions[id];
  localStorage.setItem('questions', JSON.stringify(questions));
};

export const testing = () => {
  localStorage.setItem('questions', JSON.stringify({}));
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

  if (getQuestions().length !== 1 || getQuestions()[1] !== sampleQuestion) {
    throw new Error('Create question failed');
  }
};
