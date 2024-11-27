import { reportComment } from '@/lib/Report/createReportHelper';
import verifyUser from '@/lib/verifyUser';

async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { commentId, reason } = req.body;

        if (!commentId || !reason) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        const report = await reportComment(req.user.id, reason, commentId);

        if (!report) {
            return res.status(400).json({ error: "Bad request" });
        }

        return res.status(201).json({ message: "Report created" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
    
}

export default verifyUser(handler);