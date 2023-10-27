import { Router } from 'express';

import {
  addQuestion,
  deleteQuestionById,
  updateQuestionById,
} from '../controllers/questions';

const router = Router();

router.post('/', addQuestion);

router.put('/:uuid', updateQuestionById);

router.delete('/:uuid', deleteQuestionById);

export default router;
