import { RequestHandler } from 'express';
import { body, matchedData, param, validationResult } from 'express-validator';
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

import {
  questionCategories,
  QuestionCategory,
} from '../types/questionData.interface';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.senderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore(firebaseApp);

const collectionName: string =
  process.env.NODE_ENV === 'test' ? 'test_questions' : 'questions';

// Get all questions from DB
export const getAllQuestions: RequestHandler = async (_req, res, next) => {
  try {
    const questionsCol = collection(firebaseDB, collectionName);
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

export const addQuestion: RequestHandler[] = [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('difficulty')
    .notEmpty()
    .withMessage('Difficulty is required')
    .isInt({ min: 1, max: 3 })
    .withMessage('Difficulty must be between 1 and 3'),
  body('categories')
    .isArray({ min: 1, max: 5 })
    .withMessage('Number of categories must be between 1 and 5')
    .custom((categories: string[]) => {
      if (
        !categories.every((category) =>
          questionCategories.includes(category as QuestionCategory),
        )
      ) {
        throw new Error('Invalid category');
      }
      return true;
    }),
  body('link').isURL().withMessage('Link must be a valid URL'),
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }
    const questionData = matchedData(req);
    console.log(questionData, 'QUESTION DATA');
    questionData.slug = slugify(questionData.title, {
      lower: true,
      strict: true,
    });
    try {
      const questionsCol = collection(firebaseDB, collectionName);

      const q = query(questionsCol, where('slug', '==', questionData.slug));
      const hasQueryResults = !(await getDocs(q)).empty;
      if (hasQueryResults) {
        res.status(400).json({ errors: [{ msg: 'Question already exists' }] });
        return;
      }
      const docRef = await addDoc(questionsCol, questionData);
      res.status(200).json({ ...questionData, uuid: docRef.id });
    } catch (error) {
      next(error);
    }
  },
];

export const updateQuestionById: RequestHandler[] = [
  param('uuid').notEmpty().trim().withMessage('UUID is required'),
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('difficulty')
    .notEmpty()
    .withMessage('Difficulty is required')
    .isInt({ min: 1, max: 3 })
    .withMessage('Difficulty must be between 1 and 3'),
  body('categories')
    .isArray({ min: 1, max: 5 })
    .withMessage('Number of categories must be between 1 and 5')
    .custom((categories: string[]) => {
      if (
        !categories.every((category) =>
          questionCategories.includes(category as QuestionCategory),
        )
      ) {
        throw new Error('Invalid category');
      }
      return true;
    }),
  body('link').isURL().withMessage('Link must be a valid URL'),
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }
    const { uuid } = req.params as { uuid: string };
    const updatedData = matchedData(req);
    try {
      const questionDoc = doc(firebaseDB, collectionName, uuid);
      updatedData.slug = slugify(updatedData.title, {
        lower: true,
        strict: true,
      });
      const q = query(
        collection(firebaseDB, collectionName),
        where('slug', '==', updatedData.slug),
      );
      const queryResults = await getDocs(q);
      if (
        queryResults.size > 1 ||
        (queryResults.size === 1 && queryResults.docs[0].id !== uuid)
      ) {
        res.status(400).json({ errors: [{ msg: 'Question already exists' }] });
        return;
      }
      await updateDoc(questionDoc, updatedData);
      res.status(200).json({ ...updatedData, uuid });
    } catch (error) {
      next(error);
    }
  },
];

export const deleteQuestionById: RequestHandler[] = [
  param('uuid').notEmpty().trim().withMessage('UUID is required'),
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }
    const { uuid } = req.params as { uuid: string };
    try {
      const questionDoc = doc(firebaseDB, collectionName, uuid);
      await deleteDoc(questionDoc);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
];

export const getQuestionBySlug: RequestHandler[] = [
  param('slug')
    .notEmpty()
    .trim()
    .withMessage('Slug is required')
    .isSlug()
    .withMessage('Slug is invalid'),
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }
    const { slug } = req.params as { slug: string };
    try {
      const q = query(
        collection(firebaseDB, collectionName),
        where('slug', '==', slug),
      );
      const queryQuestions = (await getDocs(q)).docs;
      if (queryQuestions.length === 0) {
        res.status(404).json({ errors: [{ msg: 'Question not found' }] });
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
  },
];

export const getTwoRandomQuestionsByDifficulty: RequestHandler[] = [
  param('difficulty')
    .notEmpty()
    .trim()
    .withMessage('Difficulty is required')
    .isInt({ min: 1, max: 3 })
    .withMessage('Difficulty must be between 1 and 3'),
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }
    const difficulty = parseInt(req.params?.difficulty, 10);
    try {
      const q = query(
        collection(firebaseDB, collectionName),
        where('difficulty', '==', difficulty),
      );
      const queryQuestions = (await getDocs(q)).docs;
      if (queryQuestions.length === 0) {
        res.status(404).json({ errors: [{ msg: 'Question not found' }] });
        return;
      }
      const randomIndex1 = Math.floor(Math.random() * queryQuestions.length);
      const tmp = Math.floor(Math.random() * queryQuestions.length - 1);
      const randomIndex2 = tmp >= randomIndex1 ? tmp + 1 : tmp;
      const question1 = queryQuestions[randomIndex1];
      const question2 = queryQuestions[randomIndex2];
      res.status(200).json([
        {
          uuid: question1.id,
          ...question1.data(),
        },
        {
          uuid: question2.id,
          ...question2.data(),
        },
      ]);
    } catch (error) {
      next(error);
    }
  },
];
