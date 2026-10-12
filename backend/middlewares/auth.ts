import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: String
        [key: string]: any
    }
}

export const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'Cade o token, painho?' });
        return
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2){
        res.status(401).json({ error: 'Token erro' });
        return
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)){
        res.status(401).json({ error: 'Token malformatado' });
        return
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });

        req.user = { id: (decoded as any).id };
        return next();
    });
};