// validação
import {Response, Request, NextFunction} from 'express'
import Joi from 'joi'

export const validar = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false })

        if (error) {
            const messages = error.details.map(detail => detail.message)

            res.status(400).json({
                message: "dados tão errados, painho",
                error: messages
            })
        }

        return next()
    }
}

