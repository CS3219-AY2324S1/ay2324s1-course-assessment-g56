import * as bodyParser from 'body-parser';
import cors from 'cors';
import { UUID } from 'crypto';
import express from 'express';

import 'dotenv/config';

import {
  addQuestion,
  deleteQuestionById,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
} from './firebase/service';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

/**
 * Firebase routes
 */
app.get('/questions', async (req, res) => {
  try {
    const questions = await getAllQuestions();
    res.json(questions);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/questions', async (req, res) => {
  try {
    const questionData = req.body;
    const questionId = await addQuestion(questionData);
    res.json({ uuid: questionId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/questions', async (req, res) => {
  try {
    const { uuid, ...updatedData } = req.body;
    await updateQuestionById(uuid, updatedData);
    res.json({ message: 'Question updated successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/questions', async (req, res) => {
  try {
    const { uuid } = req.body;
    await deleteQuestionById(uuid);
    res.json({ message: 'Question deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/questions/getById/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params as { uuid: UUID }; // Type assertion to specify the type of uuid
    const question = await getQuestionById(uuid);
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(process.env.QUESTION_SERVICE_PORT, () => {
  console.log(`> Ready on http://localhost:${process.env.QUESTION_SERVICE_PORT}`);	
});
