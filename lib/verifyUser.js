import jwt from 'jsonwebtoken';

export default function verifyUser(handler) {

    return async function(req, res) {

        const auth_header = req.headers.authorization;
        
        if (!auth_header) {
            if (req.method === 'GET') {
                return handler(req, res);
            }
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = auth_header.split(' ')[1];

        if (!token) {
            if (req.method === 'GET') {
                return handler(req, res);
            }
            return res.status(401).json({ error: 'Token missing' });
        }

        try {
            const decoded_payload = jwt.verify(token, process.env.JWT_SECRET);
            const user = decoded_payload.data;
            req.user = user;

            if (user.role !== 'user' && user.role !== 'admin') {
                return res.status(403).json({ error: "Access forbidden: not a user" });
            }

            return handler(req, res);
        } 
        catch (error) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

    };

}