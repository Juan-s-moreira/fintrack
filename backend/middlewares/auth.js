const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ error: 'Cade o token, painho?' });

    const parts = authHeader.split(' ');

    if (!parts.length === 2)
        return res.status(401).json({ error: 'Token erro' });

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).json({ error: 'Token malformatado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });

        req.userId = decoded.id; 
        return next();
    });
};