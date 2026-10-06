import { Router } from 'express';
import { login, register, verifyEmail, forgotPassword } from '../controllers/authController';

// @ts-ignore
import validar from '../../schemas/validate.js';

// @ts-ignore
import usuarioSchemas from '../../schemas/usuarioSchemas.js';

const  {loginSchema, registerSchema} = usuarioSchemas;

const router = Router();

router.post('/login', validar(loginSchema), login);
router.post('/register', validar(registerSchema), register);
router.get('/verify-email', verifyEmail);
router.post('/forgotPassword', forgotPassword);

export default router;