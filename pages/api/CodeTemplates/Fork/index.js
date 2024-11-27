import prisma from '@/lib/prisma';
import verifyUser from '@/lib/verifyUser';

async function handler(req, res) {
    
    if (req.method === "POST") {

        try {
            let { id } = req.body;

            if (!id) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            id = parseInt(id);
            // Get original template
            const originalTemplate = await prisma.codeTemplate.findUnique({
                where: { id: id },
                include: { tags: true }
            });

            if (!originalTemplate) {
                return res.status(404).json({ error: "Original template not found" });
            }

            // Check if the user already forked the original template
            const existingFork = await prisma.codeTemplate.findFirst({
                where: {
                    createdUserId: req.user.id,
                    forkedFromID: originalTemplate.id
                }
            });

            if (existingFork) {
                return res.status(400).json({ error: "User already forked this template" });
            }

            if (originalTemplate.createdUserId === req.user.id) {
                return res.status(400).json({ error: "User cannot fork their own template" });
            }

            // Create new forked template
            const newTemplate = await prisma.codeTemplate.create({
                data: {
                    title: originalTemplate.title,
                    explanation: originalTemplate.explanation,
                    code: originalTemplate.code,
                    language: originalTemplate.language,
                    tags: originalTemplate.tags ? {
                        connect: originalTemplate.tags.map(tag => ({
                            id: tag.id
                        }))
                    } : undefined,
                    createdUserId: req.user.id,
                    forkedFromID: originalTemplate.id
                }
            });

            return res.status(201).json(newTemplate);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }

    else {
        return res.status(405).json({ error: "Method not allowed" });
    }

}

export default verifyUser(handler); 