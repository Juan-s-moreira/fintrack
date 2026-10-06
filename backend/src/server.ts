import express, {Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

const PORT = process.env.PORT || 3000;

connectDB()


app.use('/api', authRoutes);
app.use('/api/financeiro', transactionRoutes);

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        message: ' API TA RODANDO PAINHO',
        status: 'TA POTENTE OIA'
    })
})

// ----------------------------------------------------------------------
// ROTAS DA API / DASHBOARD
// ----------------------------------------------------------------------


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});