// import request from 'supertest';
// import * as bodyParser from 'body-parser';
// import { addQuestion, deleteQuestionById, getAllQuestions, updateQuestionById } from '../src/controllers/questions';
// import { QuestionDataFromFrontend } from '../src/types/questionData.interface';
// import express, {Express} from 'express';
// import { server } from '../src/app';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// import { server } from './mockApp'
dotenv.config({
  path: '.env',
});

// const { data, error } = await supabase.auth.signInWithOtp({
//   email: process.env.TEST_ACCOUNT_EMAIL,
// })

// const { data, error } = await supabase.auth.signInWithOtp({
//   email: 'jiahaolow2020@email.com',
// })
// onst { data, error } = await supabase.auth.signIn('jiahaolow2020@email.com');

// console.log(data.link)
// const easyValue = 1;
// const mediumValue = 2;
// const hardValue = 3;
// let questionData: QuestionDataFromFrontend = {
//   title: 'Test Question 1',
//   description: 'This is a test question',
//   category: 'Testing',
//   complexity: mediumValue,
//   link: 'www.example.com',
// };

// let app: Express;

// let secondQuestionData: QuestionDataFromFrontend = {
//   title: 'Test Question 2',
//   description: 'This is the second test question',
//   category: 'Testing',
//   complexity: hardValue,
//   link: 'www.example.com',
// };

// let questionDataWithSameTitle: QuestionDataFromFrontend = {
//   title: 'Test Question 1',
//   description: 'This is a test question with only the same title',
//   category: 'Insert, Testing',
//   complexity: easyValue,
//   link: 'www.example.com/extra',
// };

// async function generateAndSendMagicLink(email: string) {
//   try {
//     // Generate a magic link for the given email
//     const { data, error } = await supabase.auth.signInWithOtp({ email });

//     if (error) {
//       console.error('Error generating magic link:', error);
//       return;
//     }
//     console.log(data, "DATA")
//     // 'data' should contain a success message, and Supabase will send an email with the magic link
//     console.log('Magic link generated successfully:', data);

//     // You would typically send an email to the user with the magic link
//     // Here, we'll just log the generated magic link
//     console.log('Magic Link URL:', data);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

describe('Integration Tests', () => {
  beforeAll(async () => {
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_KEY || '',
    );
    console.log(process.env.SUPABASE_URL, 'SUPABASE URLs');
    if (process.env.TEST_ACC_EMAIL !== undefined) {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: process.env.TEST_ACC_EMAIL,
      });
      console.log(data, 'DATA');
      console.log(error, 'ERROR');
    }
  });

  it('should allow CORS with the correct origin', async () => {
    console.log('RUNNING');
  });

  //   const correctOrigin = process.env.FRONTEND_SERVICE; // Replace with your frontend service URL
  //   if (correctOrigin === undefined) {
  //     fail("Environment variable not set up properly")
  //   }
  //    // Replace with your frontend service URL

  //   await request(server)
  //     .get('/user')
  //     .set('Origin', correctOrigin)
  //     .expect('Access-Control-Allow-Origin', correctOrigin)
  //     .expect('Access-Control-Allow-Credentials', 'true')
  //     .expect(200);

  //   // Add more assertions as needed
  // });

  // it('should not allow CORS with an incorrect origin', async () => {
  //   const wrongOrigin = 'http://localhost:10000';

  //   const response1 = await request(server)
  //     .get('/user')
  //     .set('Origin', wrongOrigin)
  //     // .expect(404);
  //   console.log(response1.headers, "response1 HEADER")
  //   console.log(response1.body, "response1 body")
  // });

  // beforeAll( () => {
  //   app = express();
  //   app.use(bodyParser.urlencoded({ extended: true }));
  //   app.use(bodyParser.json())

  //   // Add the route to the app
  //   app.get('/questions', getAllQuestions);
  //   app.post('/questions', addQuestion);
  //   app.put('/questions/:uuid', updateQuestionById);
  //   app.delete('/questions/:uuid', deleteQuestionById);

  // })

  // // GET TESTING
  // it('GET /questions should return a list of questions', async () => {
  //   const response = await request(app).get('/questions');

  //   // Expect a successful response
  //   expect(response.status).toBe(200);
  //   expect(response.type).toBe('application/json');
  //   expect(Array.isArray(response.body)).toBe(true);
  // });

  // // ADDITION TESTING
  // it('POST /questions should add a question with title "Test Question 1"', async () => {
  //   //Assuming with Authorization headers
  //   const response = await request(app).post('/questions').send(questionData);
  //   expect(response.status).toBe(200);
  //   expect(response.type).toBe('application/json');
  //   expect(response.body).toHaveProperty('uuid');
  //   questionData.uuid = response.body.uuid;
  // });

  // it('POST /questions with duplicate title should return an error', async () => {
  //   const response = await request(app)
  //     .post('/questions')
  //     .send(questionDataWithSameTitle);

  //   expect(response.status).toBe(400);
  //   expect(response.type).toBe('application/json');
  //   expect(response.body).toHaveProperty('error');
  // });

  // it('POST /questions should add a question with title "Test Question 2"', async () => {
  //   const response = await request(app)
  //     .post('/questions')
  //     .send(secondQuestionData);
  //   expect(response.status).toBe(200);
  //   expect(response.type).toBe('application/json');
  //   expect(response.body).toHaveProperty('uuid');
  //   secondQuestionData.uuid = response.body.uuid;
  // });

  // // // UPDATE TESTING
  // it('PUT /questions should fail to update a question into one where the title already exists', async () => {
  //   // Now, send a PUT request to update the first question into the second question title
  //   const updatedFirstQuestionData: QuestionDataFromFrontend = {
  //     ...questionData,
  //     title: 'Test Question 2',
  //   };

  //   const updateQuestionResponse = await request(app)
  //     .put(`/questions/${updatedFirstQuestionData.uuid}`)
  //     .send({
  //       uuid: updatedFirstQuestionData.uuid,
  //       ...updatedFirstQuestionData,
  //     });

  //   expect(updateQuestionResponse.status).toBe(400);
  //   expect(updateQuestionResponse.type).toBe('application/json');
  //   expect(updateQuestionResponse.body).toHaveProperty(
  //     'error',
  //     'Question already exists',
  //   );
  // });

  // it('PUT /questions should update a question as long as no other question with the same title exists', async () => {
  //   // Now, send a PUT request to update the first question to follow the second question
  //   const updatedFirstQuestionData: QuestionDataFromFrontend = {
  //     ...secondQuestionData,
  //     uuid: questionData.uuid,
  //     title: questionData.title,
  //   };

  //   const updateQuestionResponse = await request(app)
  //     .put(`/questions/${updatedFirstQuestionData.uuid}`)
  //     .send({
  //       uuid: updatedFirstQuestionData.uuid,
  //       ...updatedFirstQuestionData,
  //     });

  //   expect(updateQuestionResponse.status).toBe(200);
  //   expect(updateQuestionResponse.type).toBe('application/json');
  //   expect(updateQuestionResponse.body).toEqual({
  //     ...updatedFirstQuestionData,
  //     slug: updateQuestionResponse.body.slug
  //   });
  //   Object.assign(questionData, updatedFirstQuestionData);
  // });

  // // DELETION TESTING
  // it('DELETE /questions should delete questionData', async () => {
  //   // Now, send a DELETE request to delete questionData
  //   const deleteQuestionResponse = await request(app)
  //     .delete(`/questions/${questionData.uuid}`)
  //     .send();

  //   expect(deleteQuestionResponse.status).toBe(204);
  // });

  // it('DELETE /questions should delete secondQuestionData', async () => {
  //   // Now, send a DELETE request to delete secondQuestionData
  //   const deleteQuestionResponse = await request(app)
  //     .delete(`/questions/${secondQuestionData.uuid}`)
  //     .send();

  //   expect(deleteQuestionResponse.status).toBe(204);
  // });
  // afterAll(() => {
  //   server.close();
  // })
});
