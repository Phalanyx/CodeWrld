import jwt from 'jsonwebtoken';

export default function verifyAdminToken(req, res) {
    try {
    if (!req.headers.authorization || !req.method === 'POST') {
        return res.status(401).json({ error: 'Something went wrong' });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }
    const decoded_payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = decoded_payload.data;

    if (admin.role !== 'admin') {
        return res.status(403).json({ status: "False"});
    }
    return res.status(200).json({ status: "True"});


} catch (error) {
    return res.status(401).json({ "error": "Token expired" });
}
}

