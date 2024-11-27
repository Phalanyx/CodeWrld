import { useEffect, useState } from "react";
import Reports from '../components/Reports';
import { toast } from 'react-toastify';
import { useContext } from "react";
import { AppContext } from '@/lib/AppVars';

interface RatingComponentProps {
    blogPostId?: number;
    commentId?: number;
    rating: number;
}

function RatingComponent({ blogPostId, commentId, rating }: RatingComponentProps) {

    const context = useContext(AppContext);

    const [ratingValue, setRatingValue] = useState<number>(rating);
    const [userHasRated, setUserHasRated] = useState<boolean>(false);
    const [userRatingValue, setUserRatingValue] = useState<number>(0);

    useEffect(() => {

        const fetchRatingStatus = async () => {
            if (context?.userID) {
                if (!blogPostId && !commentId || blogPostId && commentId) {
                    return;
                }

                const type = blogPostId ? 'Blog' : 'Comment';
                const idType = blogPostId ? 'blogPostId' : 'commentId';
                const id = blogPostId || commentId;

                const response = await fetch(`/api/Ratings/${type}?userId=${context?.userID}&${idType}=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.error('Error fetching rating status!');
                    return;
                }

                const { hasRated, ratingValue } = await response.json();
                setUserHasRated(hasRated);
                setUserRatingValue(ratingValue);
            }
        };

        fetchRatingStatus();
        
    }, [context?.userID, blogPostId, commentId, rating]);

    const createRating = async (value: number, id: number, type: 'Blog' | 'Comment') => {
        const response = await fetch(`/api/Ratings/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ value, id }),
        });

        if (!response.ok) {
            toast.error('Error creating rating!');
            return;
        }

        setRatingValue(ratingValue + value);

        if (userHasRated && userRatingValue === -1 * value) {
            setUserHasRated(false);
            setUserRatingValue(0);
            toast.info('Rating removed!');
            return;
        }
        
        setUserHasRated(true);
        setUserRatingValue(value);
    };

    return (
        <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <button
                    onClick={async () => {
                        if (blogPostId) {
                            await createRating(1, blogPostId, 'Blog');
                        } else if (commentId) {
                            await createRating(1, commentId, 'Comment');
                        }
                    }}
                    disabled={userHasRated && userRatingValue === 1}
                    className={`px-1 ${
                        userHasRated && userRatingValue === 1 ? "bg-gray-400 rounded cursor-not-allowed" : "bg-transparent"
                    }`}
                >
                    ⬆️
                </button>

                <div className="my-1 rounded-lg">
                    <p className="font-bold">⭐ Rating: {ratingValue}</p>
                </div>

                <button
                    onClick={async () => {
                        if (blogPostId) {
                            await createRating(-1, blogPostId, 'Blog');
                        } else if (commentId) {
                            await createRating(-1, commentId, 'Comment');
                        }
                    }}
                    disabled={userHasRated && userRatingValue === -1}
                    className={`px-1 ${
                        userHasRated && userRatingValue === -1 ? "bg-gray-400 rounded cursor-not-allowed" : "bg-transparent"
                    }`}
                >
                    ⬇️
                </button>
            </div>

            <div className="mr-auto ml-4">
                <Reports blogPostId={Number(blogPostId)} commentId={Number(commentId)} />
            </div>
        </div>
    );
}

export default RatingComponent;