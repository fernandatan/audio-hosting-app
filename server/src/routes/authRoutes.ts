import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

export default router;
