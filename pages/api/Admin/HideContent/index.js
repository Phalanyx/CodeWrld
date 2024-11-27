import verifyAdmin from '@/lib/Admin/verifyAdmin';
import hideBlog from '@/lib/Admin/hideBlog';
import hideComment from '@/lib/Admin/hideComment';

async function handler(req, res){

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try{
    const { blogPostId, commentId } = req.body;
    if (blogPostId && commentId) {
        return res.status(400).json({ message: 'Bad request' });
    }

    if (blogPostId) {

        const blogPost = await hideBlog(parseInt(blogPostId));
        if (!blogPost) {
            return res.status(400).json({ message: 'Bad request' });
        }
        
        return res.status(200).json({ message: 'Blog post hidden' });
    }
    else if (commentId) {
        const comment = await hideComment(parseInt(commentId));
        if (!comment) {
            return res.status(400).json({ message: 'Bad request' });
        }
        return res.status(200).json({ message: 'Comment hidden' });
    }
    else{
        return res.status(400).json({ message: 'Bad request' });
    }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    } 

}

export default verifyAdmin(handler);