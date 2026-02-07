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

    repeat_password:
        Joi.ref('password')
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
        .required(),


    password: Joi.string()
        .password()
        .messages({
            'any.required': "bote a senha aqui bote"
        })



})

module.exports = {
    registerSchema,
    loginSchema
}