import prisma from '@/lib/prisma';
import verifyUser from '@/lib/Comments/verifyUser';

async function handler(req, res) {

    const { id } = req.query;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    if (req.method === "PUT") {

        try {
            const { content } = req.body;

            const data = {};

            if (content) {
                data.content = content;
            }

            const updatedComment = await prisma.Comment.update({
                where: { 
                    id: parseInt(id), 
                    inappropriate: false
                },
                data: data
            });

            return res.status(200).json(updatedComment);
        } 
        
        catch (error) {
            return res.status(500).json({ error: error.message });
        }

    } 
    
    else if (req.method === "DELETE") {

        try {
            await prisma.Comment.delete({
                where: { id: parseInt(id) }
            });

            return res.status(200).json({ message: "Comment successfully deleted" });
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