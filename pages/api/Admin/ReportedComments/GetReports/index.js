import prisma from '@/lib/prisma';
import verifyAdmin from '@/lib/Admin/verifyAdmin';


async function handler(req, res) {

    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    try {
        const { id, page } = req.query;
        if (!id) {
            return res.status(400).json({ error: "Bad Request" });
        }

        const reports = await prisma.report.findMany({
            where: {
                commentId: parseInt(id)
            },
            include: {
                createdBy: true
            },
            skip: parseInt(page ?? 0) * 5,
            take: 5
        });

        res.status(200).json({ reports });
    }


    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default verifyAdmin(handler);