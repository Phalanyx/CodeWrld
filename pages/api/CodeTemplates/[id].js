import prisma from '@/lib/prisma';
import verifyUser from '@/lib/CodeTemplates/verifyUser';

async function handler(req, res) {

    const { id } = req.query;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    if (req.method === "PUT") {

        try {
            const { title, explanation, code, language, tags } = req.body;
            const data = {};

            if (title) {
                data.title = title;
            }
            if (explanation) {
                data.explanation = explanation;
            }
            if (code) {
                data.code = code;
            }
            if (language) {
                data.language = language;
            }
            if (tags) {
                // Reset tags and connect new ones
                data.tags = {
                    set: [], 
                    connectOrCreate: tags.map(tag => ({
                        where: { name: tag },
                        create: { name: tag }
                    }))
                };
            }

            const updatedCodeTemplate = await prisma.CodeTemplate.update({
                where: { id: parseInt(id) },
                data: data
            });

            return res.status(200).json(updatedCodeTemplate);
        } 
        
        catch (error) {
            return res.status(500).json({ error: error.message });
        }

    } 
    
    else if (req.method === "DELETE") {

        try {
            await prisma.CodeTemplate.delete({
                where: { id: parseInt(id) }
            });

            return res.status(200).json({ message: "Code template successfully deleted" });
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