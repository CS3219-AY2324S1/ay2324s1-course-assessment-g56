import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import request from 'supertest';

import {
  addQuestion,
  deleteQuestionById,
  getAllQuestions,
  updateQuestionById,
} from '../src/controllers/questions'; // Import your Express route and Firebase app here
import { QuestionDataFromFrontend } from '../src/types/questionData.interface';

dotenv.config({
  path: '../src/.env',
});

console.log(process.env, 'ENVIRONMENT');
console.log(process.env.apiKey, 'API KEY');
console.log(process.env.NODE_ENV, 'NODE ENV');

const easyValue = 1;
const mediumValue = 2;
const hardValue = 3;
const questionData: QuestionDataFromFrontend = {
  title: 'Test Question 1',
  description: 'This is a test question',
  categories: ['String'],
  difficulty: mediumValue,
  link: 'www.example.com',
};

let app: Express;

const secondQuestionData: QuestionDataFromFrontend = {
  title: 'Test Question 2',
  description: 'This is the second test question',
  categories: ['String', 'Array'],
  difficulty: hardValue,
  link: 'www.example.com',
};

const questionDataWithSameTitle: QuestionDataFromFrontend = {
  title: 'Test Question 1',
  description: 'This is a test question with only the same title',
  categories: ['String', 'Sort'],
  difficulty: easyValue,
  link: 'www.example.com/extra',
};

describe('Integration Tests', () => {
  beforeAll(() => {
    app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Add the route to the app
    app.get('/questions', getAllQuestions);
    app.post('/questions', addQuestion);
    app.put('/questions/:uuid', updateQuestionById);
    app.delete('/questions/:uuid', deleteQuestionById);
  });

  // GET TESTING
  it('GET /questions should return a list of questions', async () => {
    const response = await request(app).get('/questions');

    // Expect a successful response
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(Array.isArray(response.body)).toBe(true);
  });

  // ADDITION TESTING
  it('POST /questions should add a question with title "Test Question 1"', async () => {
    // Assuming with Authorization headers
    const response = await request(app).post('/questions').send(questionData);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('uuid');
    questionData.uuid = response.body.uuid;
  });

  it('POST /questions with duplicate title should return an error', async () => {
    const response = await request(app)
      .post('/questions')
      .send(questionDataWithSameTitle);

    expect(response.status).toBe(400);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('error');
  });

  it('POST /questions should add a question with title "Test Question 2"', async () => {
    const response = await request(app)
      .post('/questions')
      .send(secondQuestionData);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('uuid');
    secondQuestionData.uuid = response.body.uuid;
  });

  // // UPDATE TESTING
  it('PUT /questions should fail to update a question into one where the title already exists', async () => {
    // Now, send a PUT request to update the first question into the second question title
    const updatedFirstQuestionData: QuestionDataFromFrontend = {
      ...questionData,
      title: 'Test Question 2',
    };

    const updateQuestionResponse = await request(app)
      .put(`/questions/${updatedFirstQuestionData.uuid}`)
      .send({
        uuid: updatedFirstQuestionData.uuid,
        ...updatedFirstQuestionData,
      });

    expect(updateQuestionResponse.status).toBe(400);
    expect(updateQuestionResponse.type).toBe('application/json');
    expect(updateQuestionResponse.body).toHaveProperty(
      'error',
      'Question already exists',
    );
  });

  it('PUT /questions should update a question as long as no other question with the same title exists', async () => {
    // Now, send a PUT request to update the first question to follow the second question
    const updatedFirstQuestionData: QuestionDataFromFrontend = {
      ...secondQuestionData,
      uuid: questionData.uuid,
      title: questionData.title,
    };

    const updateQuestionResponse = await request(app)
      .put(`/questions/${updatedFirstQuestionData.uuid}`)
      .send({
        uuid: updatedFirstQuestionData.uuid,
        ...updatedFirstQuestionData,
      });

    expect(updateQuestionResponse.status).toBe(200);
    expect(updateQuestionResponse.type).toBe('application/json');
    expect(updateQuestionResponse.body).toEqual({
      ...updatedFirstQuestionData,
      slug: updateQuestionResponse.body.slug,
    });
    Object.assign(questionData, updatedFirstQuestionData);
  });

  // DELETION TESTING
  it('DELETE /questions should delete questionData', async () => {
    // Now, send a DELETE request to delete questionData
    const deleteQuestionResponse = await request(app)
      .delete(`/questions/${questionData.uuid}`)
      .send();

    expect(deleteQuestionResponse.status).toBe(204);
  });

  it('DELETE /questions should delete secondQuestionData', async () => {
    // Now, send a DELETE request to delete secondQuestionData
    const deleteQuestionResponse = await request(app)
      .delete(`/questions/${secondQuestionData.uuid}`)
      .send();

    expect(deleteQuestionResponse.status).toBe(204);
  });
});
