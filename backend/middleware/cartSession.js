const { randomUUID } = require('crypto');

module.exports = (req, res, next) => {
    let sessionId = req.cookies?.cartSession;
    if (!sessionId || !/^[0-9a-f-]{36}$/i.test(sessionId)) {
        sessionId = randomUUID();
        res.cookie('cartSession', sessionId, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/'
        });
    }
    req.cartSessionId = sessionId;
    next();
};
