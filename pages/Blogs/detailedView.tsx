import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import CommentComponent from '@/pages/components/Comment';
import RatingComponent from '@/pages/components/Rating';
import { AppContext } from '@/lib/AppVars';
import { toast } from 'react-toastify';
import BackgroundGradient from '../components/BackgroundGradient';
import TagSelector from '../components/TagSelector';
import TemplateSelector from '../components/TemplateSelector';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  tags: { name: string }[];
  codeTemplates: CodeTemplate[];
  createdBy: { id: number; userName: string, avatar: string };
  rating: number;
}

interface Comment {
  id: number;
  content: string;
  rating: number;
  createdBy: { userName: string };
  inappropriate: boolean;
}

interface CodeTemplate {
  id: number;
  title: string;
  createdBy: { userName: string };
  forkedFromID: number;
}

const DetailedPostView = () => {
  const router = useRouter();
  const context = useContext(AppContext);
  const { id } = router.query;
  const pageSize = 5;
  const [inappropriate, setInappropriate] = useState(false);
  const [post, setPost] = useState<BlogPost>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [editable, setEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  
  const [updatedTags, setUpdatedTags] = useState<string[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<CodeTemplate[]>([]);

  useEffect(() => {
    if (id) {
      fetchBlogPostDetails();
    }
  }, [id]);

  useEffect(() => {
    if (post) {
      fetchComments(page);

      if (String(context?.userID) === String(post?.createdBy.id)) {
        setEditable(true);
        setUpdatedTitle(post.title || '');
        setUpdatedDescription(post.description || '');
        setUpdatedContent(post.content || '');
        setUpdatedTags(post.tags.map((tag) => tag.name) || []);
        setSelectedTemplates(post.codeTemplates || []);
      }
    }
  }, [post, page]);

  const fetchBlogPostDetails = async () => {
    const response = await fetch(`/api/BlogPosts?id=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
      }
    });

    if (!response.ok) {
      console.error('Error fetching blog post details');
      return;
    }

    const data = await response.json();

    data.inappropriate ? setInappropriate(true) : null;
    setPost(data);
  };

  const fetchComments = async (page: number) => {
    if (!post) return;

    const response = await fetch(`/api/Comments?blogPostId=${post.id}&page=${page}&pageSize=${pageSize}&order=desc`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
      },
    });

    if (!response.ok) {
      console.error('Error fetching comments');
      setTotalPages(1);
      return;
    }

    const data = await response.json();
    setComments(data.comments);
    setTotalPages(data.totalPages);
  };

  const deleteBlogPost = async () => {
    const response = await fetch(`/api/BlogPosts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      toast.error('Error deleting blog post!');
      return;
    }

    toast.success('Blog post deleted successfully!');

    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const saveChanges = async () => {
    const updatedPost = {
      title: updatedTitle,
      description: updatedDescription,
      content: updatedContent,
      tags: updatedTags,
      codeTemplates: selectedTemplates.map((template) => template.id),
    };

    if (!updatedPost.title || !updatedPost.description || !updatedPost.content.trim()) {
      toast.warning('Title, description, and content cannot be empty!');
      return;
    }

    const response = await fetch(`/api/BlogPosts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(updatedPost),
    });

    if (!response.ok) {
      toast.error('Error updating post!');
      return;
    }

    fetchBlogPostDetails();
    setIsEditing(false);
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') {
      toast.warning('Comment cannot be empty.');
      return;
    }

    const response = await fetch('/api/Comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ content: newComment, blogPostId: post?.id }),
    });

    if (!response.ok) {
      toast.error('Error submitting comment!');
      return;
    }

    toast.success('Comment submitted successfully!');

    setNewComment('');
    fetchComments(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  if (!post) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 mb-4">
      { 
      <BackgroundGradient className="p-4 rounded-2xl bg-cta-background">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <input
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="border p-2 w-full rounded outline-none focus:ring focus:border"
            />
          ) : (
            <h2 className="text-xl font-semibold">{post.title}</h2>
          )}
          {!isEditing &&
          <div className="flex items-center space-x-2 border rounded-full p-2">
            <img
              src={`data:image/jpeg;base64,${post.createdBy.avatar}`}
              alt=""
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
            <span className="font-semibold font-mono text-md">{post.createdBy.userName}</span>
          </div>
    }   
        </div>

        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className="border p-2 w-full rounded outline-none focus:ring focus:border"
              rows={3}
            />
          ) : (
            <p className="text-lg">{post.description}</p>
          )}
        </div>

        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              className="border p-2 w-full rounded outline-none focus:ring focus:border"
              rows={5}
            />
          ) : (
            <p>{post.content}</p>
          )}
        </div>

        {isEditing ? (
          <TagSelector tags={updatedTags} setTags={setUpdatedTags} />
        ) : (
          post.tags && post.tags.length > 0 && (
            <div className="flex space-x-2 mt-4">
              {post.tags.map((tag) => (
                <span className="px-2 py-1 rounded" id="tag" key={tag.name}>
                  {tag.name}
                </span>
              ))}
            </div>
          )
        )}
        
        {isEditing ? (
          <TemplateSelector originalTemplates={selectedTemplates} onTemplatesChange={setSelectedTemplates}/>
        ) : (
          post.codeTemplates && post.codeTemplates.length > 0 && (
            <div className="flex space-x-2 mt-6">
              {post.codeTemplates.map((template) => (
                <span key={template.id} className="px-2 py-1 cursor-pointer rounded border" id="template"
                onClick={() => router.push(`/Templates/detailedView?id=${template.id}`)}>
                  {template.title}
                </span>
              ))}
            </div>
          )
        )}

        {editable && (
          <div className="flex justify-center mt-8 space-x-4">
            { inappropriate ?             
            <button
              className="bg-transparent text-red-500 border-2 border-red-500 font-bold py-2 px-4 rounded">
              Inappropriate Content
            </button> : 
            <button
              onClick={isEditing ? saveChanges : toggleEditMode}
              className="bg-transparent text-gray-400 border-2 border-gray-400 font-bold py-2 px-4 rounded">
              {isEditing ? 'Save Changes' : 'Edit Blog'}
            </button>
            }
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this Post?')) {
                  deleteBlogPost();
                } 
                else {
                  toast.info('Deletion cancelled!');
                }
              }}
              className="bg-transparent text-red-500 border-2 border-red-500 font-bold py-2 px-4 rounded">
              <i className="fas fa-trash"></i>
            </button>
          </div>
        )}

        <div className="mt-6">
          <RatingComponent blogPostId={post.id} rating={post.rating}/>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>

          {comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}

          <div className="mt-4 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded outline-none focus:ring focus:border"
              rows={3}
            />

            <button
              onClick={handleCommentSubmit}
              className="py-1 px-4 bg-transparent text-gray-500 absolute bottom-2 right-2 font-semibold">
              Submit Comment
            </button>
          </div>

            {totalPages > 1 && (
              <div className="flex justify-between mt-2 px-1">
                <button
                onClick={() => handlePageChange(page - 1)}
                className="py-1 px-2 rounded text-xs cursor-pointer"
                disabled={page === 1}>
                Previous
                </button>

                <button
                onClick={() => handlePageChange(page + 1)}
                className="py-1 px-2 rounded text-xs cursor-pointer"
                disabled={page === totalPages}>
                Next
                </button>
              </div>
            )}

        </div>
      </BackgroundGradient>
}
    </div>
  );

};

export default DetailedPostView;