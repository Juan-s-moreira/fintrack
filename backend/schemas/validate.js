"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validar = void 0;
const validar = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            res.status(400).json({
                message: "dados tão errados, painho",
                error: messages
            });
        }
        return next();
    };
};
exports.validar = validar;
