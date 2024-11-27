import jwt from 'jsonwebtoken';

export default function verifyAdmin(handler) {

    return async function(req, res) {
        const auth_header = req.headers.authorization;

        if (!auth_header) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = auth_header.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        try {
            const decoded_payload = jwt.verify(token, process.env.JWT_SECRET);
            const admin = decoded_payload.data;
            req.admin = admin;

            if (admin.role !== 'admin') {
                return res.status(403).json({ error: "Access forbidden: not an admin" });
            }

            return handler(req, res);
        } 
        catch (error) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    };

}

