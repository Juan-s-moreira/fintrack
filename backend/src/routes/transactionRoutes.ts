import { Router } from 'express';

import {
    addTransaction,
    deleteTransaction,
    getTransactions,
    getMonthlyTransactions,
    updateTransaction
} from '../controllers/transactionControllers';

// @ts-ignore
import authMiddleware from '../../middlewares/auth';
// @ts-ignore
import validar from '../../schemas/validate.js';
// @ts-ignore
import transactionSchema from '../../schemas/financeSchema.js';

const router = Router()

router.post('/add', authMiddleware, validar(transactionSchema), addTransaction);
router.get('/get', authMiddleware, getTransactions);
router.get('/monthly', authMiddleware, getMonthlyTransactions);
router.put('/:id', authMiddleware, validar(transactionSchema), updateTransaction);
router.delete('/:id', authMiddleware, deleteTransaction);

export default router;