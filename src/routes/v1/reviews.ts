import express from 'express';
import { signup, login } from '../../controllers/v1/auth.controller';
const router = express.Router();

router.put('/:review_id', signup);

router.delete('/:review_id', login);

export default router;
