import { rateComment } from '@/lib/Rating/createRatingHelper';
import verifyUser from '@/lib/verifyUser';
import prisma from '@/lib/prisma';

async function handler(req, res) {

    if (req.method === 'POST') {
        try {
            const { id, value } = req.body;

            if (!id || !value) {
                return res.status(400).json({ error: "Missing parameters" });
            }

            if (parseInt(value) !== 1 && parseInt(value) !== -1) {
                return res.status(400).json({ error: "Invalid rating value" });
            }

            const rating = await rateComment(req.user.id, value, id);

            if (!rating) {
                return res.status(400).json({ error: "Bad request" });
            }

            return res.status(201).json({ message: "Rating created or removed" });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    else if (req.method === 'GET') {
        try {
            const userId = req.query.userId;
            const postId = req.query.commentId;

            const post = await prisma.Comment.findUnique({
                where: { id: parseInt(postId) },
                include: { userRatings: true },
            });

            if (!post) {
                return res.status(404).json({ hasRated: false, ratingValue: 0 });
            }

            const userRating = post.userRatings.find((rating) => rating.createdUserId === parseInt(userId));

            if (userRating) {
                return res.status(200).json({ hasRated: true, ratingValue: userRating.value });
            }

            return res.status(200).json({ hasRated: false, ratingValue: 0 });
        } 
        catch (error) {
            return res.status(500).json({ hasRated: false, ratingValue: 0 });
        }
    }

    else {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
}

export default verifyUser(handler);