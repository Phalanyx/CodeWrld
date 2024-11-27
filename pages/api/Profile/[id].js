import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    try {
        const id = req.query.id;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const user = await prisma.User.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                userName: true,
                avatar: true,
                phoneNumber: true
            }
        });
        user ? res.status(200).json(user) : res.status(404).json({ error: "User not found" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}