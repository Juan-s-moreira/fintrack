const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');
const connectDB = require('./database');
const FinanceData = require('./models/FinanceData'); // Importa o modelo
const validar = require('./schemas/validate')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
const { loginSchema, registerSchema } = require('./schemas/usuarioSchemas')

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());
const PORT = process.env.PORT || 3000;
connectDB()



// ----------------------------------------------------------------------
// FUNÇÃO DE CÁLCULO E PERSISTÊNCIA (Lógica de Negócio Central)
// ----------------------------------------------------------------------
// const calculateAndSave = async ({ valorTotal, ganhos, despesas }) => {
//     // 1. Acha o único documento (como não tem autenticação, só haverá 1)
//     let data = await FinanceData.findOne();

//     if (!data) {
//         // Se for a primeira vez, cria o documento inicial
//         data = new FinanceData({ valorTotal, ganhos, despesas });
//     } else {
//         // Se já existir, atualiza os campos com os novos valores
//         data.valorTotal = valorTotal;
//         data.ganhos = ganhos;
//         data.despesas = despesas;
//     }

//     // 2. Realiza o cálculo crucial
//     data.valorFinal = data.valorTotal + data.ganhos - data.despesas;
//     data.lastUpdated = Date.now();

//     // 3. Salva no banco de dados
//     await data.save();
//     return data;
// };

// ----------------------------------------------------------------------
// ROTAS DA API / DASHBOARD
// ----------------------------------------------------------------------

// token de autentificação

app.get('/', (req, res) => {
    // const { token } = req.headers;

    // if (!token) {
    //     return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    // }

    return res.status(200).json({
        message: 'API RODANDO BICHINHO',
        status: 'TA POTENTE'
    });

});


app.post('/api/financeiro/add', (req, res) => {
    return res.status(200).json({
        message: 'DADO ADICIONADO COM SUCESSO painho'
    });
})


app.delete('/api/financeiro/delete', (req, res) => {
    return res.status(200).json({
        message: 'DADO DELETADO COM SUCESSO painho'
    });
})

app.get('/api/financeiro/get', (req, res) => {
    return res.status(200).json({
        message: 'DADO PEGADO COM SUCESSO painho'
    });
})

app.put('/api/financeiro/update', (req, res) => {
    return res.status(200).json({
        message: 'DADO ATUALIZADO COM SUCESSO painho'
    });
})


// ROTA 1: PEGAR DADOS
// GET /api/financeiro
// app.get('/api/financeiro', async (req, res) => {
//     try {
//         const data = await FinanceData.findOne();
//         if (!data) {
//             return res.status(200).json({
//                 valorTotal: 0,
//                 ganhos: 0,
//                 despesas: 0,
//                 valorFinal: 0,
//                 message: "Nenhum dado encontrado. O estado inicial foi retornado."
//             });
//         }
//         res.json(data);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// // ROTA 2: EDITAR/ATUALIZAR DADOS (O que você queria!)
// // PUT /api/financeiro
// app.put('/api/financeiro', async (req, res) => {
//     try {
//         // Pega os novos valores do corpo da requisição.
//         // O user pode mandar apenas um campo, mas o resto será pego do DB.
//         const { valorTotal, ganhos, despesas } = req.body;

//         // Se o usuário não enviou nenhum campo, retorna erro.
//         if (valorTotal === undefined && ganhos === undefined && despesas === undefined) {
//             return res.status(400).json({ message: "Pelo menos um dos campos (valorTotal, ganhos, despesas) deve ser fornecido para a atualização." });
//         }

//         // Pega os dados atuais para usar como fallback (garantir que não sobrescrevemos com `undefined`)
//         const currentData = await FinanceData.findOne() || {};

//         // Monta o objeto de atualização, usando o valor da requisição ou o valor atual do DB
//         const updateData = {
//             valorTotal: valorTotal !== undefined ? valorTotal : currentData.valorTotal || 0,
//             ganhos: ganhos !== undefined ? ganhos : currentData.ganhos || 0,
//             despesas: despesas !== undefined ? despesas : currentData.despesas || 0
//         };

//         // Chama a função de cálculo e salvamento
//         const updatedData = await calculateAndSave(updateData);

//         res.status(200).json(updatedData);

//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// ROTAS DA API / LOGIN



app.post('/api/login', validar(loginSchema), async (req, res) => {
    // const { token } = req.headers;
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(400).json({ error: 'email ou senha tão errados, painho' })
        }

        const senhaBate = await bcrypt.compare(password, user.password)

        if (!senhaBate) {
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
    // if (!token) {
    //     return res.status(401).json({ error: "token obrigatório pufavo" })
    // }

    // TODO -  EMAIL VALIDO @
    // if (!email) {
    //     return res.status(403).json({ error: "faltou email aqui" })
    // }
    // else {

    //     // TODO - >> 8 caracteres, caracteres especiais, letras e numeros
    //     (password)
    //     return res.status(403).json({ error: "senha ta muito fraca" })

    // }

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