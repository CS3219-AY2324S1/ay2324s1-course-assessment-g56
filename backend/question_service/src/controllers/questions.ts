import { RequestHandler } from 'express';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore/lite';
import slugify from 'slugify';

import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.senderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

const app = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore(app);

// Get all questions from DB
export const getAllQuestions: RequestHandler = async (_req, res, next) => {
  try {
    const questionsCol = collection(firebaseDB, 'questions');
    const questionSnapshot = await getDocs(questionsCol);
    const questionList = questionSnapshot.docs.map((doc) => ({
      uuid: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(questionList);
  } catch (error) {
    next(error);
  }
};

export const addQuestion: RequestHandler = async (req, res, next) => {
  const questionData = req.body;
  questionData.slug = slugify(questionData.title, {
    lower: true,
    strict: true,
  });
  try {
    const questionsCol = collection(firebaseDB, 'questions');

    const q = query(questionsCol, where('slug', '==', questionData.slug));
    const hasQueryResults = !(await getDocs(q)).empty;
    if (hasQueryResults) {
      res.status(400).json({ error: 'Question already exists' });
      return;
    }
    const docRef = await addDoc(questionsCol, questionData);
    res.status(200).json({ ...questionData, uuid: docRef.id });
  } catch (error) {
    next(error);
  }
};

export const updateQuestionById: RequestHandler = async (req, res, next) => {
  const { uuid } = req.params as { uuid: string };
  const updatedData = req.body;
  try {
    const questionDoc = doc(firebaseDB, 'questions', uuid);
    updatedData.slug = slugify(updatedData.title, {
      lower: true,
      strict: true,
    });
    const q = query(
      collection(firebaseDB, 'questions'),
      where('slug', '==', updatedData.slug),
    );
    const queryResults = await getDocs(q);
    if (
      queryResults.size > 1 ||
      (queryResults.size === 1 && queryResults.docs[0].id !== uuid)
    ) {
      res.status(400).json({ error: 'Question already exists' });
      return;
    }
    await updateDoc(questionDoc, updatedData);
    res.status(200).json({ ...updatedData, uuid });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestionById: RequestHandler = async (req, res, next) => {
  const { uuid } = req.params as { uuid: string };
  try {
    const questionDoc = doc(firebaseDB, 'questions', uuid);
    await deleteDoc(questionDoc);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const getQuestionBySlug: RequestHandler = async (req, res, next) => {
  const { slug } = req.params as { slug: string };
  try {
    const q = query(
      collection(firebaseDB, 'questions'),
      where('slug', '==', slug),
    );
    const queryQuestions = (await getDocs(q)).docs;
    if (queryQuestions.length === 0) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }
    const question = queryQuestions[0];
    res.status(200).json({
      uuid: question.id,
      ...question.data(),
    });
  } catch (error) {
    next(error);
  }
};
