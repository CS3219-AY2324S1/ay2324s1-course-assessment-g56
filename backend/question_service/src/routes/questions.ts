import { Router } from 'express';

import { getAllQuestions, getQuestionBySlug } from '../controllers/questions';

const router = Router();

router.get('/', getAllQuestions);

router.get('/:slug', getQuestionBySlug);

export default router;
