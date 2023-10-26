import {
  QuestionComplexity,
  QuestionComplexityToNumberMap,
} from 'frontend/src/types/question';
import request from 'supertest';

import { QuestionData } from './firebase/interface';
import { app, server } from './app';

const questionData: QuestionData = {
  title: 'Test Question 1',
  description: 'This is a test question',
  category: 'Testing',
  complexity: QuestionComplexityToNumberMap[QuestionComplexity.MEDIUM],
  link: 'www.example.com',
};

const secondQuestionData: QuestionData = {
  title: 'Test Question 2',
  description: 'This is the second test question',
  category: 'Testing',
  complexity: QuestionComplexityToNumberMap[QuestionComplexity.HARD],
  link: 'www.example.com',
};

const questionDataWithSameTitle: QuestionData = {
  title: 'Test Question 1',
  description: 'This is a test question with only the same title',
  category: 'Insert, Testing',
  complexity: QuestionComplexityToNumberMap[QuestionComplexity.EASY],
  link: 'www.example.com/extra',
};

describe('Integration Tests', () => {
  // GET TESTING
  it('GET /questions should return a list of questions', async () => {
    const response = await request(app).get('/questions');

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(Array.isArray(response.body)).toBe(true);
  });

  // ADDITION TESTING
  it('POST /questions should add a question with title "Test Question 1"', async () => {
    const response = await request(app).post('/questions').send(questionData); // Send the question data in the request
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('uuid');
    questionData.uuid = response.body.uuid;
  });

  it('POST /questions with duplicate title should return an error', async () => {
    const response = await request(app)
      .post('/questions')
      .send(questionDataWithSameTitle);

    expect(response.status).toBe(400); // Expect a 400 status code for the error
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

  // UPDATE TESTING
  it('PUT /questions should fail to update a question into one where the title already exists', async () => {
    // Now, send a PUT request to update the first question into the second question
    const updatedFirstQuestionData: QuestionData = {
      ...questionData,
      title: 'Test Question 2',
    };
    const updateQuestionResponse = await request(app)
      .put('/questions')
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
    // Now, send a PUT request to update the first question to follow the second question. Except only title is different
    const updatedFirstQuestionData: QuestionData = {
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

    expect(updateQuestionResponse.status).toBe(200);
    expect(updateQuestionResponse.type).toBe('application/json');
    expect(updateQuestionResponse.body).toEqual({
      message: 'Question updated successfully',
    });
    Object.assign(questionData, updatedFirstQuestionData);
  });

  // DELETION TESTING
  it('DELETE /questions should delete questionData', async () => {
    // Now, send a DELETE request to delete questionData
    const deleteQuestionResponse = await request(app)
      .delete('/questions')
      .send({ uuid: questionData.uuid });

    expect(deleteQuestionResponse.status).toBe(200);
    expect(deleteQuestionResponse.type).toBe('application/json');
    expect(deleteQuestionResponse.body).toEqual({
      message: 'Question deleted successfully',
    });
  });

  it('DELETE /questions should delete secondQuestionData', async () => {
    // Now, send a DELETE request to delete secondQuestionData
    const deleteQuestionResponse = await request(app)
      .delete('/questions')
      .send({ uuid: secondQuestionData.uuid });

    expect(deleteQuestionResponse.status).toBe(200);
    expect(deleteQuestionResponse.type).toBe('application/json');
    expect(deleteQuestionResponse.body).toEqual({
      message: 'Question deleted successfully',
    });
  });
});

afterAll((done) => {
  server.close(done);
});
