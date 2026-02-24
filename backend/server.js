const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');

dotenv.config();


const connectDB = require('./database');
const validar = require('./schemas/validate')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { loginSchema, registerSchema } = require('./schemas/usuarioSchemas')
const authMiddleware = require('./middlewares/auth')
const FinanceData = require('./models/FinanceData');
const { transactionSchema } = require('./schemas/financeSchema')
const { sendVerificationEmail } = require('./services/mailer')

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


app.delete('/api/financeiro/:id', authMiddleware, async (req, res) => {
    const { id } = req.params

    try {
        const deletedIncome = await FinanceData.findByIdAndDelete(id)


        if (!deletedIncome) {
            return res.status(404).json({ error: "Transação não encontrada!" })
        }

        return res.status(200).json({
            message: "Transação apagada, painho,  foi  porreta"
        })

    } catch (error) {
        console.log("Erro ao deletar", error);
        return res.status(500).json({ error: "erro ao apagar Transação" })
    }

})

app.get('/api/financeiro/get', authMiddleware, async (req, res) => {
    try {
        const transactions = await FinanceData.find({ user: req.userId }).sort({ createdAt: -1 })
        return res.status(200).json(transactions);
    } catch (error) {
        return res.status(400).json({ error: "erro ao verificar dados" })
    }
})

app.put('/api/financeiro/:id', authMiddleware, validar(transactionSchema), async (req, res) => {
    const { id } = req.params
    const updateIncome = req.body

    try {
        const updatedIncome = await FinanceData.findByIdAndUpdate(
            id,
            updateIncome,
            { new: true, runValidators: true }
        )

        if (!updatedIncome) {
            return res.status(404).json({ error: "Despesa não encontrada, painho" })
        }
        return res.status(200).json({
            message: 'DADO ATUALIZADO COM SUCESSO painho',
            data: updatedIncome
        });
    } catch (error) {
        console.error("Erro ao atualizar, painho", error);
        return res.status(500).json({ error: "Erro ao atualizar despesa" })
    }
})




// ROTAS DA API / LOGIN

app.post('/api/login', validar(loginSchema), async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(400).json({ error: 'email ou senha tão errados, painho' })
        }


        if (!user.isVerified) {
            return res.status(403).json({ error: 'Você precisa verificar seu e-mail primeiro, painho!' });
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

        const existingUser = await User.findOne({ email })

        if (existingUser) {

            if (existingUser.isVerified) {
                return res.status(400).json({ error: "vish painho, já tem esse email aqui" });
            }
            const newCode = Math.floor(100000 + Math.random() * 900000).toString()
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt);

            existingUser.verificationCode = newCode
            existingUser.password = hashedPassword

            // existingUser.password = await bcrypt.hash(password, salt)

            // await existingUser.save()
            await User.updateOne(
                {
                    _id: existingUser._id
                },
                {
                    $set: {verificationCode: newCode, password: hashedPassword}
                }
            )

            await sendVerificationEmail(email, newCode)

            return res.status(200).json({
                message: "Faltou a verificação painho. Estamos enviando um novo código",
                email: email
            })
        }


        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        await User.create({
            email,
            password: hashedPassword,
            isVerified: false,
            verificationCode: code
        })

        await sendVerificationEmail(email, code);

        // user.password = undefined

        return res.status(200).json({
            message: 'Usuário criado com sucesso, painho! Verifique seu Email',
            email: email
        });
    } catch (err) {
        console.log("CÓDIGO DO ERRO:", err.code); 
        console.log("MENSAGEM:", err.message);
        
        if (err.code === 11000) {
            const userDeNovo = await User.findOne({ email });
            if (userDeNovo && !userDeNovo.isVerified) {
                const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                userDeNovo.verificationCode = newCode;
                await userDeNovo.save();
                await sendVerificationEmail(email, newCode);

                return res.status(200).json({
                    message: "Faltou a verificação painho. Estamos enviando um novo código",
                    email: email
                });
            }
        }

        console.error("Erro no registro, painho", err);
        return res.status(400).json({ error: "deu bom aqui não veinho, vamo de novo" });
    }
});

app.put('/api/forgetPassword', (req, res) => {
    return res.status(200).json({
        message: 'SENHA ALTERADA COM SUCESSO painho'
    });
})




// autenticação via SMS - encaminhar email de confirmação, captcha !TODO


app.post('/api/verify-email', async (req, res) => {
    const { email, code } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'Conta já está verificada!' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ error: 'Código inválido ou incorreto, painho.' });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        return res.status(200).json({ message: 'E-mail verificado com sucesso! Pode logar.' });

    } catch (error) {
        return res.status(500).json({ error: 'Erro ao verificar o código.' });
    }
});


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});