import { UUID } from 'crypto';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from 'firebase/firestore/lite';

import 'dotenv/config';

import { QuestionData } from './interface';

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
export async function getAllQuestions() {
  const questionsCol = collection(firebaseDB, 'questions');
  const questionSnapshot = await getDocs(questionsCol);
  const questionList = questionSnapshot.docs.map((doc) => doc.data());
  return questionList;
}

export async function addQuestion(questionData: QuestionData) {
  const questionsCol = collection(firebaseDB, 'questions');
  const docRef = await addDoc(questionsCol, questionData);
  // return docRef._key.path.segments[1];
  return docRef.id;
}

export async function updateQuestionById(
  uuid: UUID,
  updatedData: QuestionData,
) {
  const questionDoc = doc(firebaseDB, 'questions', uuid);
  await updateDoc(questionDoc, updatedData);
}

export async function deleteQuestionById(uuid: UUID) {
  const questionDoc = doc(firebaseDB, 'questions', uuid);
  await deleteDoc(questionDoc);
}

export async function getQuestionById(uuid: UUID) {
  const questionDoc = doc(firebaseDB, 'questions', uuid);
  const docSnapshot = await getDoc(questionDoc);
  if (docSnapshot.exists()) {
    return docSnapshot.data();
  }
  return null;
}