"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.transactionSchema = joi_1.default.object({
    description: joi_1.default.string().required().messages({
        'any.required': 'Tem que dizer o que foi, painho (descrição)'
    }),
    value: joi_1.default.number().min(0.01).required().messages({
        'number.min': 'O valor tem que ser maior que zero',
        'any.required': 'Botou o valor não?'
    }),
    type: joi_1.default.string().valid('income', 'expense').required().messages({
        'any.only': 'O tipo só pode ser income (ganho) ou expense (gasto)'
    }),
    category: joi_1.default.string().optional().allow(''),
    paymentMethod: joi_1.default.string().optional().allow(''),
    isRecurring: joi_1.default.boolean().optional(),
    recurrenceFrequency: joi_1.default.string().optional().allow(''),
    installments: joi_1.default.object({
        current: joi_1.default.number().required(),
        total: joi_1.default.number().required()
    }).optional().allow(null),
    fitId: joi_1.default.string().optional().allow('')
});
