import prisma from '@/lib/prisma';

export async function reportBlog(createdBy, reason, blogPostId){
    try {

        const existingReport = await prisma.report.findFirst({
            where: {
                blogPostId: blogPostId,
                createdUserId: createdBy
            }
        });

        if (existingReport) {
            return false;
        }

        const report = await prisma.report.create({
            data: {
                reason: reason,
                blogPostId: blogPostId,
                createdUserId: createdBy
            }
        })
    
        if (!report) {
            return false;
        }

        const data = await prisma.BlogPost.update({
            where: {
                id: blogPostId
            },
            data: {
                reportcount: {
                    increment: 1
                },
                reports: {
                    connect: report
                }
            }
        });

        return data ? true : false;
    }
    catch (error) {
        return false;
    }
}

export async function reportComment(createdBy, reason, commentId){
    try {

        const existingReport = await prisma.report.findFirst({
            where: {
                commentId: commentId,
                createdUserId: createdBy
            }
        });

        if (existingReport) {
            return false;
        }

        const report = await prisma.report.create({
            data: {
                reason: reason,
                commentId: commentId,
                createdUserId: createdBy
            }
        })
    
        if (!report) {
            return false;
        }

        const data = await prisma.Comment.update({
            where: {
                id: commentId
            },
            data: {
                reportcount: {
                    increment: 1
                },
                reports: {
                    connect: report
                }
            }
        });

        return data ? true : false;
    }
    catch (error) {
        return false;
    }
}