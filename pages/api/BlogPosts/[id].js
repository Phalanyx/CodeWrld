import prisma from '@/lib/prisma';
import verifyUser from '@/lib/BlogPosts/verifyUser';

async function handler(req, res) {

    const { id } = req.query;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    if (req.method === "PUT") {

        try {
            const { title, description, content, tags, codeTemplates } = req.body; 

            const data = {};

            if (title) {
                data.title = title;
            }
            if (description) {
                data.description = description;
            }
            if (content) {
                data.content = content;
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
            if (codeTemplates) {
                // Check if all code templates referenced exist
                const existingTemplates = await prisma.CodeTemplate.findMany({
                    where: {
                        id: {
                            in: codeTemplates.filter(templateId => templateId !== undefined)
                        }
                    }
                });

                if (existingTemplates.length !== codeTemplates.length) {
                    return res.status(400).json({ error: "Some code templates do not exist" });
                }

                // Reset code templates and connect new ones
                data.codeTemplates = {
                    set: [],
                    connect: codeTemplates.map(templateId => ({
                        id: templateId
                    }))
                };
            }

            const updatedBlogPost = await prisma.BlogPost.update({
                where: { 
                    id: parseInt(id), 
                    inappropriate: false
                },
                data: data
            });

            return res.status(200).json(updatedBlogPost);
        } 
        
        catch (error) {
            return res.status(500).json({ error: error.message });
        }

    } 
    
    else if (req.method === "DELETE") {

        try {
            await prisma.BlogPost.delete({
                where: { id: parseInt(id) }
            });

            return res.status(200).json({ message: "Blog post successfully deleted" });
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