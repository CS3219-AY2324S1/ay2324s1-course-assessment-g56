import * as bodyParser from 'body-parser';
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

/**
 * Firebase routes
 */
app.get('/questions', async (req, res) => {
  try {
    const questions = await getAllQuestions();
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/questions', async (req, res) => {
  try {
    const questionData = req.body;
    const questionId = await addQuestion(questionData);
    res.json({ uuid: questionId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/questions', async (req, res) => {
  try {
    const { uuid, ...updatedData } = req.body;
    await updateQuestionById(uuid, updatedData);
    res.json({ message: 'Question updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/questions', async (req, res) => {
  try {
    const { uuid } = req.body;
    await deleteQuestionById(uuid);
    res.json({ message: 'Question deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/questions/getById', async (req, res) => {
  try {
    const { uuid } = req.body;
    const question = await getQuestionById(uuid);
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5001, () => {
  console.log(`> Ready on http://localhost:5001`);
});