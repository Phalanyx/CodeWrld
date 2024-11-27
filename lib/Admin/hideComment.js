import prisma from '@/lib/prisma';
export default async function hideComment(CommentID) {
    try {
        const Comment = await prisma.Comment.findUnique({
            where: {
                id: CommentID
            }
        });
        if (!Comment) {
            return null;
        }
        await prisma.Comment.update({
            where: {
                id: CommentID
            },
            data: {
                inappropriate: true,
            }
        });

        const deleteReports = await prisma.report.deleteMany({
            where: {
                commentId: CommentID
            }
        });

        return Comment;
    }
    catch (error) {
        return null;
    }
}

