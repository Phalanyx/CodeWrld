import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/pages/components/Navbar';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  tags: { name: string }[];
  codeTemplates: { id: number; title: string }[];
  createdBy: { userName: string };
}

interface Comment {
  id: number;
  content: string;
  createdBy: { userName: string };
}

const CommentComponent: React.FC<{ comment: Comment }> = ({ comment }) => {

  const pageSize = 5;

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReplies(1);
  }, []);

  const fetchReplies = async (page: number) => {
    const response = await fetch(`/api/Comments?repliedToId=${comment.id}&page=${page}&pageSize=${pageSize}&order=desc`);

    if (!response.ok) {
      console.error(`Error fetching replies for comment ${comment.id}`);
      setTotalPages(1);
      setHasMore(false);
      return;
    }

    const data = await response.json();

    console.log(data);

    setReplies((prevReplies) => (page === 1 ? data.comments : [...prevReplies, ...data.comments]));
    setTotalPages(data.totalPages);

  };

  const toggleExpand = () => {
    if (!isExpanded) {
      setPage(1);
      fetchReplies(1);
    } 
    else {
      setReplies([]);
    }
    setIsExpanded(!isExpanded);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (!comment) {
    return;
  }

  return (
    <div className="border p-4 m-1">

      <div className="flex justify-between items-center">
        <p className="inline-block ml-2">{comment.content} 
          - <span className="italic font-semibold">{comment.createdBy.userName}</span>
        </p>

        {hasMore && (
          <button onClick={toggleExpand} className="text-primary p-1 mt-2 bg-transparent">
          {isExpanded ? '⬆' : '⬇'}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="ml-2 mt-2">
          {replies.map((reply) => (
            <CommentComponent key={reply.id} comment={reply} />
          ))}

          <div className="flex justify-between mt-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              className="py-1 px-2 rounded text-xs"
              disabled={page === 1}>
              Previous
            </button>

            <button
              onClick={() => handlePageChange(page + 1)}
              className="py-1 px-2 rounded text-xs"
              disabled={page === totalPages}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

};

const DetailedPostView = () => {

  const router = useRouter();
  const { id } = router.query;
  const pageSize = 5;

  const [post, setPost] = useState<BlogPost>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (id) {
      fetchBlogPostDetails();
    }
  }, [id]);

  useEffect(() => {
    if (post) {
      fetchComments(page);
    }
  }, [post, page]);

  const fetchBlogPostDetails = async () => {
    const response = await fetch(`/api/BlogPosts?id=${id}`);

    if (!response.ok) {
      console.error('Error fetching blog post details');
      return;
    }

    const data = await response.json();

    console.log(data);
    setPost(data);
  };

  const fetchComments = async (page: number) => {
    if (!post) {
      return;
    }

    const response = await fetch(`/api/Comments?blogPostId=${post.id}&page=${page}&pageSize=${pageSize}&order=desc`);
    
    if (!response.ok) {
      console.error('Error fetching comments');
      setTotalPages(1);
      return;
    }

    const data = await response.json();

    console.log(data);

    setComments(data.comments);
    setTotalPages(data.totalPages);

  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (!post) {
    return;
  }

  return (
    <div className="fade-in container mx-auto p-4 mb-4">
      <NavBar />

      <div className="border rounded p-4">

        {post && (
          <>
            <div className="flex justify-between mt-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <span className="font-semibold">Created by: {post.createdBy.userName}</span>
            </div>
            
            <div className="mt-4">
              <p className="text-lg">{post.description}</p>
            </div>

            <div className="mt-4">
              <p>{post.content}</p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex space-x-2 mt-4">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 rounded" id="tag">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {post.codeTemplates && post.codeTemplates.length > 0 && (
              <div>
                <p className="mt-4 font-semibold">Linked Code Templates: </p>

                <div className="flex space-x-2 mt-2">
                  {post.codeTemplates.map((template) => (
                    <span
                      key={template.id}
                      className="px-2 py-1 rounded cursor-pointer"
                      id="template"
                      onClick={() => router.push(`/Templates/detailedView?id=${template.id}`)}>
                      {template.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold">Comments</h3>
          {comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}

          <div className="flex justify-between mt-4 px-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              className="py-1 px-2 rounded text-xs"
              disabled={page === 1}>
              Previous
            </button>

            <button
              onClick={() => handlePageChange(page + 1)}
              className="py-1 px-2 rounded text-xs"
              disabled={page === totalPages}>
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );

};

export default DetailedPostView;