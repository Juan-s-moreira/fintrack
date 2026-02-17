const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');
const connectDB = require('./database');
const validar = require('./schemas/validate')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { loginSchema, registerSchema } = require('./schemas/usuarioSchemas')
const authMiddleware = require('./middlewares/auth')
const FinanceData = require('./models/FinanceData');
const { transactionSchema } = require('./schemas/financeSchema')
dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());
const PORT = process.env.PORT || 3000;
connectDB()


// ----------------------------------------------------------------------
// ROTAS DA API / DASHBOARD
// ----------------------------------------------------------------------

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'API RODANDO BICHINHO',
        status: 'TA POTENTE'
    });

});


app.post('/api/financeiro/add', authMiddleware, validar(transactionSchema), async (req, res) => {

    try {
        const { description, value, type } = req.body

        const transactions = await FinanceData.create({
            description,
            value,
            type,
            user: req.userId
        })
        return res.status(200).json({
            message: 'DADO ADICIONADO COM SUCESSO painho',
            transactions,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'erro ao adicionar' })

    }
})


app.delete('/api/financeiro/delete', (req, res) => {
    return res.status(200).json({
        message: 'DADO DELETADO COM SUCESSO painho'
    });
})

app.get('/api/financeiro/get', authMiddleware, async (req, res) => {
    try {
        const transactions = await FinanceData.find({ user: req.userId }).sort({ createdAt: -1 })
        return res.status(200).json(transactions);
    } catch (error) {
        return res.status(400).json({ error: "erro ao verificar dados" })
    }
})

app.put('/api/financeiro/update', (req, res) => {
    return res.status(200).json({
        message: 'DADO ATUALIZADO COM SUCESSO painho'
    });
})




// ROTAS DA API / LOGIN

app.post('/api/login', validar(loginSchema), async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(400).json({ error: 'email ou senha tão errados, painho' })
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(400).json({ error: 'email ou senha tão errados, painho' })
        }

        user.password = undefined

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1D' }
        )
        return res.status(200).json({
            message: 'LOGIN REALIZADO COM SUCESSO painho',
            token,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "erro aqui com nois pai, tenta depois" })
    }
 
});

app.post('/api/register', validar(registerSchema), async (req, res) => {

    const { email, password } = req.body

    try {
        if (await User.findOne({ email }))
            return res.status(400).json({ error: "vish painho, já tem esse email aqui" })

        const hash = await bcrypt.hash(password, 10)

        const user = await User.create({

            email,
            password: hash,
        })

        user.password = undefined

        return res.status(200).json({
            message: 'REGISTRO REALIZADO COM SUCESSO painho'
        });
    } catch (err) {
        return res.status(400).json({ error: "deu bom aqui não veinho, vamo de novo" })
    }
});


app.put('/api/forgetPassword', (req, res) => {
    return res.status(200).json({
        message: 'SENHA ALTERADA COM SUCESSO painho'
    });
})




// autenticação via SMS - encaminhar email de confirmação, captcha !TODO


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});