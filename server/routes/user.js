import express from 'express';
import UserController from '../controllers/UserContoller';


const router = express.Router();

router.post('/signup', UserController.signup);

export default router;
