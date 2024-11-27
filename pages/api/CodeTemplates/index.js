import prisma from '@/lib/prisma';
import verifyUser from '@/lib/verifyUser';

async function handler(req, res) {
    
    if (req.method === "POST") {
        
        try {
            const { title, explanation, code, language, tags } = req.body;

            if (!title || !explanation || !code || !language ) {
                return res.status(400).json({ error: "Missing required parameters" });
            }

            const tagsLength = tags ? tags.length : 0;

            // Create new code template
            const newCodeTemplate = await prisma.CodeTemplate.create({
                data: {
                    title: title,
                    explanation: explanation,
                    code: code,
                    language: language, 
                    tags: tagsLength > 0 ? {
                        connectOrCreate: tags.map(tag => ({
                            where: { name: tag }, 
                            create: { name: tag } 
                        })),
                    } : undefined,
                    createdUserId: req.user.id,
                },
            });

            return res.status(201).json(newCodeTemplate);
        } 
        
        catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }

    else if (req.method === "GET") {

        try {
            const { id, title, explanation, language, code, tags, createdUser, createdUserID, page, pageSize } = req.query;

            if (id) {
                const codeTemplate = await prisma.CodeTemplate.findUnique({
                    where: { id: parseInt(id) },
                    include: { 
                        tags: true, 
                        createdBy: {
                            select: { id: true, userName: true, avatar: true}
                        }
                    }
                });

                if (!codeTemplate) {
                    return res.status(404).json({ error: "Code template not found" });
                }

                return res.status(200).json(codeTemplate);
            }


            if (!page || !pageSize) {
                return res.status(400).json({ error: "Page or page size missing"});
            }

            const searchFilters = [];

            if (title) {
                searchFilters.push({ title: { contains: title } });
            }
            if (explanation) {
                searchFilters.push({ explanation: { contains: explanation } });
            }
            if (language) {
                searchFilters.push({ language: language });
            }
            if (code) {
                searchFilters.push({ code: { contains: code } });
            }
            if (tags) {
                const tagsList = tags.split(",");
                tagsList.forEach(tag => {
                    searchFilters.push({ tags: { some: { name: { contains: tag } } } });
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

            const codeTemplates = await prisma.CodeTemplate.findMany({
                where: { AND: searchFilters },
                include: { 
                    tags: true, 
                    createdBy: {
                        select: { id: true, userName: true, avatar: true}
                    }
                },
                skip: (parseInt(page) - 1) * parseInt(pageSize),
                take: parseInt(pageSize),
                orderBy: { id: 'desc' }
            });

            const totalTemplates = await prisma.CodeTemplate.count({
                where: { AND: searchFilters }
            });

            const paginatedResponse = {
                totalPages: Math.ceil(totalTemplates / parseInt(pageSize)),
                codeTemplates: codeTemplates
            };

            if (codeTemplates.length === 0) {
                return res.status(404).json({ error: "No code templates found" });
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