import prisma from '@/lib/prisma';

export async function rateBlog(createdBy, value, blogPostId) {
    try {

        const existingRating = await prisma.rating.findFirst({
            where: {
                AND: [
                    { blogPostId: blogPostId },
                    { createdUserId: createdBy }
                ]
            }
        });

        if (existingRating) {
            if (existingRating.value === value) {
                return false;
            }
            else {
                await prisma.rating.delete({
                    where: {
                        id: existingRating.id
                    }
                });

                await prisma.BlogPost.update({
                    where: {
                        id: blogPostId
                    },
                    data: {
                        rating: {
                            decrement: existingRating.value
                        }
                    }
                });
            }
            return true;
        }

        const rating = await prisma.rating.create({
            data: {
                value: value,
                blogPostId: blogPostId,
                createdUserId: createdBy
            }
        });

        if (!rating) {
            return false;
        }

        const data = await prisma.BlogPost.update({
            where: {
                id: blogPostId
            },
            data: {
                rating: {
                    increment: value
                },
                userRatings: {
                    connect: rating
                }
            }
        });

        return data ? true : false;
    } 
    catch (error) {
        return false;
    }
}

export async function rateComment(createdBy, value, commentId) {
    try {

        const existingRating = await prisma.rating.findFirst({
            where: {
                AND: [
                    { createdUserId: createdBy },
                    { commentId: commentId }
                ]
            }
        });

        if (existingRating) {
            if (existingRating.value === value) {
                return false;
            }
            else {
                await prisma.rating.delete({
                    where: {
                        id: existingRating.id
                    }
                });

                await prisma.Comment.update({
                    where: {
                        id: commentId
                    },
                    data: {
                        rating: {
                            decrement: existingRating.value
                        }
                    }
                });
            }
            return true;
        }

        const rating = await prisma.rating.create({
            data: {
                value: value,
                commentId: commentId,
                createdUserId: createdBy
            }
        });

        if (!rating) {
            return false;
        }

        const data = await prisma.Comment.update({
            where: {
                id: commentId
            },
            data: {
                rating: {
                    increment: value
                },
                userRatings: {
                    connect: rating
                }
            }
        });

        return data ? true : false;
    } 
    catch (error) {
        return false;
    }
}