import { reportBlog } from '@/lib/Report/createReportHelper';
import verifyUser from '@/lib/verifyUser';

async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { blogPostId, reason } = req.body;

        if (!blogPostId || !reason) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        const report = await reportBlog(req.user.id, reason, blogPostId);

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