import { Router } from 'express';

import {
    addTransaction,
    deleteTransaction,
    getTransactions,
    getMonthlyTransactions,
    updateTransaction
} from '../controllers/transactionControllers';

// @ts-ignore
import {auth} from '../../middlewares/auth';
// @ts-ignore
import {validar} from '../../schemas/validate';
// @ts-ignore
import {transactionSchema} from '../../schemas/financeSchema';

const router = Router()

router.post('/add', auth, validar(transactionSchema), addTransaction);
router.get('/get', auth, getTransactions);
router.get('/monthly', auth, getMonthlyTransactions);
router.put('/:id', auth, validar(transactionSchema), updateTransaction);
router.delete('/:id', auth, deleteTransaction);

export default router;