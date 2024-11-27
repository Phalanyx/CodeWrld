import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import RatingComponent from '@/pages/components/Rating';

interface Comment {
  id: number;
  content: string;
  rating: number;
  createdBy: { userName: string };
  inappropriate: boolean;
}

const CommentComponent: React.FC<{ comment: Comment }> = ({ comment }) => {

  const pageSize = 5;

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentComment, setCurrentComment] = useState<Comment>(comment);
  const [newReplyContent, setNewReplyContent] = useState('');

  useEffect(() => {
    fetchReplies(page);
  }, [page]);

  useEffect(() => {
    fetchComment();
  }, []);

  const fetchComment = async () => {
    const response = await fetch(`/api/Comments?id=${comment.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')} || ''`,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching comment ${comment.id}`);
      return;
    }

    const updatedComment = await response.json();
    setCurrentComment(updatedComment);
  };

  const fetchReplies = async (page: number) => {
    const response = await fetch(`/api/Comments?repliedToId=${comment.id}&page=${page}&pageSize=${pageSize}&order=desc`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')} || ''`,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching replies for comment ${comment.id}`);
      setTotalPages(1);
      return;
    }

    const data = await response.json();

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

  const handleReplySubmit = async () => {
    if (newReplyContent.trim() === '') {
      toast.warning('Comment cannot be empty.');
      return;
    }

    const response = await fetch(`/api/Comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        content: newReplyContent,
        repliedToId: currentComment.id,
      }),
    });

    if (!response.ok) {
      toast.error('Error creating reply!');
      return;
    }

    toast.success('Comment submitted successfully!');

    setNewReplyContent('');
    fetchReplies(1);
  };

  if (!currentComment) {
    return null;
  }

  return (
    <div className="border p-4 m-1">
      <div className="flex justify-between items-center">

        <div className="flex items-center space-x-2">
          <span className="italic text-gray-400 font-semibold">{currentComment.createdBy.userName}: </span>
          <span>{currentComment.content}</span>
          {currentComment.inappropriate &&
            <span className="text-red-500"> - Inappropriate</span>
          }
        </div>
        
        <button onClick={toggleExpand} className="py-1 px-2 mt-2 rounded text-xs">
          {isExpanded ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
        </button>
      </div>

      <RatingComponent commentId={currentComment.id} rating={currentComment.rating} />

      {isExpanded && (
        <div className="ml-2 mt-2">
          {replies.map((reply) => (
            <CommentComponent key={reply.id} comment={reply} />
          ))}

            {totalPages > 1 && (
              <div className="flex justify-between">
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

          <div className="mt-4 relative">
            <textarea
              value={newReplyContent}
              onChange={(e) => setNewReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-2 border rounded outline-none focus:ring focus:border"
              rows={3}
            />

            <button
              onClick={handleReplySubmit}
              className="py-1 px-4 bg-transparent text-gray-500 absolute bottom-2 right-2 font-semibold">
              Submit Reply
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default CommentComponent;