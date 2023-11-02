import dotenv from 'dotenv';
import request from 'supertest';

import { app, server } from '../src/app';
import { QuestionDataFromFrontend } from '../src/types/questionData.interface';

dotenv.config({
  path: '../src/.env',
});

const mediumValue = 2;
const hardValue = 3;

const questionData: QuestionDataFromFrontend = {
  title: 'Test Question 1',
  description: 'This is a test question',
  category: 'Testing',
  complexity: mediumValue,
  link: 'www.example.com',
};

const secondQuestionData: QuestionDataFromFrontend = {
  title: 'Test Question 2',
  description: 'This is the second test question',
  category: 'Testing',
  complexity: hardValue,
  link: 'www.example.com',
};

describe('Integration Tests: All API request should be rejected due to no authorization header', () => {
  it('GET /questions should receive 401 reponse due to no authorization header', async () => {
    const responseNoHeader = await request(app).get('/questions');

    // No headers
    expect(responseNoHeader.status).toBe(401);
    expect(responseNoHeader.type).toBe('application/json');
    expect(responseNoHeader.body).toEqual({
      errors: [{ msg: 'Not authorized, no access token' }],
    });
  });

  it('POST /questions should receive 401 reponse due to no authorization header', async () => {
    const responseNoHeader = await request(app)
      .post('/questions')
      .send(questionData);

    expect(responseNoHeader.status).toBe(401);
    expect(responseNoHeader.type).toBe('application/json');
    expect(responseNoHeader.body).toEqual({
      errors: [{ msg: 'Not authorized, no access token' }],
    });
  });

  it('PUT /questions should receive 401 reponse due to no authorization header', async () => {
    const updatedFirstQuestionData: QuestionDataFromFrontend = {
      ...secondQuestionData,
      uuid: questionData.uuid,
      title: questionData.title,
    };

    const updateQuestionResponse = await request(app)
      .put('/questions')
      .send({
        uuid: updatedFirstQuestionData.uuid,
        ...updatedFirstQuestionData,
      });
    expect(updateQuestionResponse.status).toBe(401);
    expect(updateQuestionResponse.type).toBe('application/json');
    expect(updateQuestionResponse.body).toEqual({
      errors: [{ msg: 'Not authorized, no access token' }],
    });
  });

  it('DELETE /questions should receive 401 reponse due to no authorization header', async () => {
    // Now, send a DELETE request to delete secondQuestionData
    const responseNoHeader = await request(app)
      .delete('/questions')
      .send({ uuid: secondQuestionData.uuid });

    expect(responseNoHeader.status).toBe(401);
    expect(responseNoHeader.type).toBe('application/json');
    expect(responseNoHeader.body).toEqual({
      errors: [{ msg: 'Not authorized, no access token' }],
    });
  });

  afterAll(() => {
    server.close();
  });
});
