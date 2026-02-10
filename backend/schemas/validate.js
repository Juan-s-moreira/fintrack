// validação
const validar = (schema) => {
    return (req, res, next) => {

        const { error } = schema.validate(req.body, { abortEarly: false })

        if (error) {
            const messages = error.details.map(detail => detail.message)

            return res.status(400).json({
                message: "dados tão errados, painho",
                error: messages
            })
        }

        next()
    }
}

module.exports = validar