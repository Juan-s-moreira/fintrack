const Joi = require('joi');

const registerSchema = Joi.object({

    // TODO - caracteres especiais
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.min': "ei painho, bote pelo menos 8 ai",
            'any.required': "esqueceu de butar a senha aqui, visse"
        }),

    repeat_password: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': "acho que as senhas tão diferentes, macho"
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': "ei painho, esse email ai ta paia, visse",
            'any.required': "nois precisa do email painho",
            'string.empty': "o email não pode ser vazio, painho"
        })
})



const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': "email inválido",
            'any.required': "precisa do email pra entrar"
        }),


    password: Joi.string()
        .messages({
            'any.required': "bote a senha aqui bote",
            'string.empty': "senha não pode ser vazia"
        })



})

module.exports = {
    registerSchema,
    loginSchema
}