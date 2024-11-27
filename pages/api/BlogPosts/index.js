import prisma from '@/lib/prisma';
import verifyUser from '@/lib/verifyUser';

async function handler(req, res) {
    
    if (req.method === "POST") {
        
        try {
            const { title, description, content, tags, codeTemplates } = req.body;

            if (!title || !description || !content) {
                return res.status(400).json({ error: "Missing required parameters" });
            }

            const tagsLength = tags ? tags.length : 0;
            const codeTemplatesLength = codeTemplates ? codeTemplates.length : 0;

            // Check if all code templates referenced exist
            if (codeTemplatesLength > 0) {
                const existingTemplates = await prisma.CodeTemplate.findMany({
                    where: {
                        id: {
                            in: codeTemplates.filter(templateId => templateId !== undefined)
                        }
                    }
                });
                if (existingTemplates.length !== codeTemplatesLength) {
                    return res.status(400).json({ error: "Some code templates do not exist" });
                }
            }

            // Create new blog post
            const newBlogPost = await prisma.BlogPost.create({
                data: {
                    title: title,
                    description: description,
                    content: content,
                    tags: tagsLength > 0 ? {
                        connectOrCreate: tags.map(tag => ({
                            where: { name: tag }, 
                            create: { name: tag } 
                        })),
                    } : undefined,
                    codeTemplates: codeTemplatesLength > 0 ? {
                        connect: codeTemplates.map(templateId => ({
                            id: templateId
                        }))
                    } : undefined,
                    createdUserId: req.user.id,
                },
            });

            return res.status(201).json(newBlogPost);
        } 
        
        catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }

    else if (req.method === "GET") {

        try {
            const { id, title, description, content, tags, codeTemplates, createdUser, createdUserID, order, page, pageSize} = req.query;

            if (id) {
                const blogPost = await prisma.BlogPost.findUnique({
                    where: { id: parseInt(id) },
                    include: { 
                        tags: {
                            select: { name: true }
                        },
                        codeTemplates: {
                            select: { id: true, title: true }
                        },
                        createdBy: {
                            select: { id: true, userName: true, avatar: true}
                        }
                    }
                });

                if (!blogPost) {
                    return res.status(404).json({ error: "Blog post not found" });
                }

                if (blogPost.inappropriate) {
                    if (!req.user) {
                        return res.status(404).json({ error: "Blog post not found" });
                    }
                    if (req.user.role !== 'admin' && blogPost.createdUserId !== req.user.id) {
                        return res.status(404).json({ error: "Blog post not found" });
                    }
                }

                return res.status(200).json(blogPost);
            }

            if (!page || !pageSize) {
                return res.status(400).json({ error: "Page or page size missing"});
            }

            const searchFilters = [];

            if (title) {
                searchFilters.push({ title: { contains: title } });
            }
            if (description) {
                searchFilters.push({ description: { contains: description } });
            }
            if (content) {
                searchFilters.push({ content: { contains: content } });
            }
            if (tags) {
                const tagsList = tags.split(",");
                tagsList.forEach(tag => {
                    searchFilters.push({ tags: { some: { name: { contains: tag } } } });
                });
            }
            if (codeTemplates) {
                const codeTemplatesList = codeTemplates.split(",");
                codeTemplatesList.forEach(template => {
                    searchFilters.push({ codeTemplates: { some: { title: { contains: template } } } });
                });
            }
            if (createdUser) {
                const users = await prisma.user.findMany({
                    where: {
                        OR: [
                            { userName: { contains: createdUser } },
                            { firstName: { contains: createdUser } },
                            { lastName: { contains: createdUser } }
                        ]
                    }
                });
                if (users.length == 0) {
                    return res.status(404).json({ error: "User not found" });
                }
                searchFilters.push({ createdUserId: { in: users.map(user => user.id) } });
            }
            if (createdUserID) {
                searchFilters.push({ createdUserId: parseInt(createdUserID) });
            }

            if (req.user) { 
                if (req.user.role !== 'admin') {
                    searchFilters.push({ 
                        OR: [
                            { createdUserId: req.user.id },
                            { inappropriate: false }
                        ]
                    });
                }
            }
            else {
                searchFilters.push({ inappropriate: false });
            }   

            const blogPosts = await prisma.BlogPost.findMany({
                where: { AND: searchFilters },
                include: { 
                    tags: {
                        select: { name: true }
                    },
                    codeTemplates: {
                        select: { id: true, title: true }
                    },
                    createdBy: {
                        select: { id: true, userName: true, avatar: true}
                    }
                },
                skip: (parseInt(page) - 1) * parseInt(pageSize),
                take: parseInt(pageSize),
                orderBy: order ? [
                    { rating: order },
                    { id: 'desc' }
                ]
                : { id: 'desc' }
            });

            const totalPosts = await prisma.BlogPost.count({
                where: { AND: searchFilters }
            });

            const paginatedResponse = {
                totalPages: Math.ceil(totalPosts / parseInt(pageSize)),
                posts: blogPosts
            };

            if (blogPosts.length === 0) {
                return res.status(404).json({ error: "No blog posts found" });
            }
            
            return res.status(200).json(paginatedResponse);
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