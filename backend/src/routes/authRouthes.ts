import { Router } from 'express';
import { login, register, verifyEmail, forgotPassword } from '../controllers/authController';

const validar = require('../schemas/validate');
const {loginSchema, registerSchema} = require('../schemas/usuarioSchemas');

const router = Router();

router.post('/login', validar(loginSchema), login);
router.post('/register', validar(registerSchema), register);
router.get('/verify-email', verifyEmail);
router.post('/forgotPassword', forgotPassword);

export default router;