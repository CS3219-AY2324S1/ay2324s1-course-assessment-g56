// import { firebaseDB } from "./module";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore/lite";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import dotenv from "dotenv";
import { UUID } from "crypto";

dotenv.config();

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

interface Question {
  question_id: UUID;
  title: string;
  category: string;
  complexity: number;
  link: number;
  description: string;
}

// Get all questions from DB
export async function getAllQuestions() {
  const questionsCol = collection(firebaseDB, "questions");
  const questionSnapshot = await getDocs(questionsCol);
  const questionList = questionSnapshot.docs.map((doc) => doc.data());
  return questionList;
}

export async function addQuestion(questionData: Question) {
  const questionsCol = collection(firebaseDB, "questions");
  const docRef = await addDoc(questionsCol, questionData);
  return docRef._key.path.segments[1];
}

export async function updateQuestionById(uuid: UUID, updatedData: any) {
  const questionDoc = doc(firebaseDB, "questions", uuid);
  await updateDoc(questionDoc, updatedData);
}

export async function deleteQuestionById(uuid: UUID) {
  const questionDoc = doc(firebaseDB, "questions", uuid);
  await deleteDoc(questionDoc);
}

export async function getQuestionById(uuid: UUID) {
  const questionDoc = doc(firebaseDB, "questions", uuid);
  const docSnapshot = await getDoc(questionDoc);
  if (docSnapshot.exists()) {
    return docSnapshot.data();
  } else {
    return null;
  }
}
