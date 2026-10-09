import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

import { sendVerificationEmail } from "../services/mailer";


// rota de olgin
export const login = async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ email}).select('+password');

        if(!user || !user.password) {
            res.status(400).json({error: ' email ou senha erradim, painho'})
            return
        }

        if(!user.isVerified) {
            res.status(403).json({ error: 'tem que verificar, painho'})
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) {
            res.status(400).json({error: 'email ou senha erradim, painho'})
            return
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET || 'secret',
            {expiresIn: '1D'}
        )

        res.status(200).json({
            message: 'login realizado com sucesso, painho',
            token,
            user
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'ihh erro com nois aqui neg@, pera ai'})
    }
}

// rota de registro
export const register = async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body
    
    try {
        const existingUser = await User.findOne({ email })

        if(existingUser) {
            if (existingUser.isVerified) {
                res.status(400).json({error: 'vish painho, esse email ja tem aqui viu'})
                return
            }

            const newCode = Math.floor(100000 + Math.random() * 900000).toString()
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            await User.updateOne(
                { _id: existingUser._id },
                {$set: {verificationCode: newCode, password: hashedPassword}}
            )

            await sendVerificationEmail(email, newCode)

            res.status(200).json({
                message: 'Faltou a verificação painho. Estamos enviando um novo código',
                email: email
            })
            return
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

        await sendVerificationEmail(email, code)

        res.status(200).json({
            message: 'Usuario criado com sucesso painho, oia seu email',
            email: email
        })
    } catch (err: any) {
        if (err.code === 11000) {
            const userDeNovo = await User.findOne({email})
            if(userDeNovo && !userDeNovo.isVerified) {
                const newCode = Math.floor(100000 + Math.random() * 900000).toString()
                userDeNovo.verificationCode = newCode
                await userDeNovo.save()
                await sendVerificationEmail(email, newCode)

                res.status(200).json({
                    message: 'ihh nao verifivou, estamos enviando um novo codigo, painho',
                    email: email
                })
                return
            }
        }
        console.error('erro no registro painho', err)
        res.status(400).json({error: 'deu bom aqui nao veinho, vamo de novo'})
    }
}

// verificar email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const {email, code} = req.body

    try {
        const user = await User.findOne({email})

        if(!user) {
            res.status(404).json({error: 'ihh nao tem esse email aqui, painho'})
            return
        }

        if(user.isVerified) {
            res.status(400).json({error: 'ihh ja verificado, painho'})
            return
        }

        if(user.verificationCode !== code) {
            res.status(400).json({error: 'codigo invalido ou incorreto, painho'})
            return
        }

        user.isVerified = true
        user.verificationCode = undefined
        await user.save()

        res.status(200).json({
            message: 'email verificado com sucesso, painho, pode logar'
        })
    } catch ( error) {
        res.status(500).json({ error: 'ihh deu ruim no codigo aqui em, tenta de novo' })
    }
}

// esqueci a senha
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const {email} = req.body

    try {
        const user = await User.findOne({email})

        if(!user) {
            res.status(404).json({error: 'ihh nao tem esse email aqui, painho'})
            return
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
        user.verificationCode = resetCode
        await user.save()

        await sendVerificationEmail(email, resetCode)

        res.status(200).json({
            message: 'codigo de redecuperacao enviado, painho, olha seu email',
            email: email
        })
    } catch ( error) {
        console.error('erro na recuperaco de senha, painho', error)
        res.status(500).json({ error: 'ihh deu ruim na recuperaco de senha, tenta de novo' })
    }
}

// reset senha
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, code, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ error: 'ihh nao tem esse email aqui, painho' });
            return;
        }

        if (user.verificationCode !== code) {
            res.status(400).json({ error: 'codigo invalido ou incorreto, painho' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.verificationCode = undefined;
        await user.save();

        res.status(200).json({
            message: 'senha redefinida com sucesso, painho, pode logar'
        });
    } catch (error) {
        console.error('erro ao resetar a senha, painho', error);
        res.status(500).json({ error: 'ihh deu ruim no reset da senha aqui em, tenta de novo' });
    }
};

// codigo de recuperacao
// verificar código de recuperação de senha
export const verifyResetCode = async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ error: 'ihh nao tem esse email aqui, painho' });
            return;
        }

        if (user.verificationCode !== code) {
            res.status(400).json({ error: 'codigo invalido ou incorreto, painho' });
            return;
        }

        res.status(200).json({
            message: 'codigo valido, painho! pode alterar a senha'
        });
    } catch (error) {
        console.error('erro ao verificar codigo, painho', error);
        res.status(500).json({ error: 'ihh deu ruim na verificacao, tenta de novo' });
    }
};