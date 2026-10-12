"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    // TODO - caracteres especiais
    password: joi_1.default.string()
        .min(8)
        .required()
        .messages({
        'string.min': "ei painho, bote pelo menos 8 ai",
        'any.required': "esqueceu de butar a senha aqui, visse"
    }),
    repeat_password: joi_1.default.any()
        .valid(joi_1.default.ref('password'))
        .required()
        .messages({
        'any.only': "acho que as senhas tão diferentes, macho"
    }),
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': "ei painho, esse email ai ta paia, visse",
        'any.required': "nois precisa do email painho",
        'string.empty': "o email não pode ser vazio, painho"
    })
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': "email inválido",
        'any.required': "precisa do email pra entrar"
    }),
    password: joi_1.default.string()
        .messages({
        'any.required': "bote a senha aqui bote",
        'string.empty': "senha não pode ser vazia"
    })
});
