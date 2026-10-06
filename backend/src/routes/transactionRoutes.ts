import { Router } from 'express';

import {
    addTransaction,
    deleteTransaction,
    getTransactions,
    getMonthlyTransactions,
    updateTransaction
} from '../controllers/transactionControllers';

const authMiddleware = require('../middleware/auth');
const validar = require('../middleware/validate');
const transactionSchema = require('../shcemas/financeSchema');

const router = Router()

router.post('/add', authMiddleware, validar(transactionSchema), addTransaction);
router.get('/get', authMiddleware, getTransactions);
router.get('/monthly', authMiddleware, getMonthlyTransactions);
router.put('/:id', authMiddleware, validar(transactionSchema), updateTransaction);
router.delete('/:id', authMiddleware, deleteTransaction);

export default router;