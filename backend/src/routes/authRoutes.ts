import { Router } from 'express';
import { login, register, verifyEmail, forgotPassword, resetPassword, verifyResetCode } from '../controllers/authController';

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
router.post('/verify-code', verifyResetCode)
router.post('/resetPassword', resetPassword);

export default router;