import express from 'express';
import { signup, login } from '../../controllers/v1/auth.controller';
const router = express.Router();


router.post('/signup', signup);

router.post('/login', login);



export default router;
