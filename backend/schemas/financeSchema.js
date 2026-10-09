
// const Joi = require('joi');

// const transactionSchema = Joi.object({
//     description: Joi.string().required().messages({
//         'any.required': 'Tem que dizer o que foi, painho (descrição)'
//     }),
//     value: Joi.number().min(0.01).required().messages({
//         'number.min': 'O valor tem que ser maior que zero',
//         'any.required': 'Botou o valor não?'
//     }),
//     type: Joi.string().valid('income', 'expense').required().messages({
//         'any.only': 'O tipo só pode ser income (ganho) ou expense (gasto)'
//     })
// });

// module.exports = transactionSchema;


const Joi = require('joi');

const transactionSchema = Joi.object({
    description: Joi.string().required().messages({
        'any.required': 'Tem que dizer o que foi, painho (descrição)'
    }),
    value: Joi.number().min(0.01).required().messages({
        'number.min': 'O valor tem que ser maior que zero',
        'any.required': 'Botou o valor não?'
    }),
    type: Joi.string().valid('income', 'expense').required().messages({
        'any.only': 'O tipo só pode ser income (ganho) ou expense (gasto)'
    }),
    category: Joi.string().optional().allow(''),
    paymentMethod: Joi.string().optional().allow(''),
    isRecurring: Joi.boolean().optional(),
    recurrenceFrequency: Joi.string().optional().allow(''),
    installments: Joi.number().optional().allow(null),
    fitId: Joi.string().optional().allow('')
});

module.exports = transactionSchema;