import React, { useState, useEffect } from 'react';
import { MapPin, Users, Facebook, Linkedin, Youtube, Twitter, Reply, X } from 'lucide-react';
import axios from 'axios';
import axiosIns from '../../services/axiosIns';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

// Interfaces for API responses
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    statusCode: string;
}

interface ReplyType {
    id: number;
    content: string;
    userId: number;
    username: string;
    createdAt: string;
    updatedAt: string;
}

interface CommentType {
    id: number;
    content: string;
    userId: number;
    companyId: number;
    username: string;
    createdAt: string;
    updatedAt: string;
    replies: ReplyType[];
}


const getComments = async (companyId: number) => {
    const response = await axiosIns.get<ApiResponse<CommentType[]>>(`/comments/${companyId}`);
    return response.data;
};

const createComment = async (content: string, companyId: number, userId: number) => {
    try {
        const response = await axiosIns.post<ApiResponse<CommentType>>('/comments', {
            content,
            companyId,
            userId
        });
        return response.data;
    } catch (error) {
        // Xử lý lỗi token hết hạn
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            // Token hết hạn, yêu cầu đăng nhập lại
            // Có thể chuyển hướng đến trang đăng nhập hoặc refresh token
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        throw error;
    }
};

const createReply = async (content: string, commentId: number, userId: number) => {
    try {
        const response = await axiosIns.post<ApiResponse<ReplyType>>('/replies', {
            content,
            commentId,
            userId
        });
        return response.data;
    } catch (error) {
        // Tương tự như createComment
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        throw error;
    }
};

// Comment component
const Comment = ({
    comment,
    onAddReply,
    userId
}: {
    comment: CommentType;
    onAddReply: (commentId: number, content: string) => Promise<void>;
    userId: number;
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        await onAddReply(comment.id, replyContent);
        setReplyContent('');
        setIsReplying(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);

        if (diffInHours < 1) return `${diffInMinutes} phút trước`;
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        return `${Math.floor(diffInHours / 24)} ngày trước`;
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">{comment.username}</span>
                <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-gray-600">{comment.content}</p>

            <button
                onClick={() => setIsReplying(!isReplying)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
                {isReplying ? (
                    <>
                        <X className="w-4 h-4" />
                        Hủy
                    </>
                ) : (
                    <>
                        <Reply className="w-4 h-4" />
                        Trả lời
                    </>
                )}
            </button>

            {isReplying && (
                <form onSubmit={handleSubmitReply} className="mt-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Viết câu trả lời của bạn..."
                            className="flex-grow p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Gửi
                        </button>
                    </div>
                </form>
            )}

            {comment.replies.length > 0 && (
                <div className="mt-3 space-y-3 pl-6 border-l-2 border-gray-200">
                    {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-white rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-700 text-sm">{reply.username}</span>
                                <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{reply.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Main CommentCard component
const CommentCard = ({ companyId, userId }: { companyId: number; userId: number }) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isLoggedIn } = useSelector((state: RootState) => state.authReducer);
    const navigate = useNavigate();

    useEffect(() => {
        fetchComments();
    }, [companyId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await getComments(companyId);
            setComments(response.data);
            setError(null);
        } catch (err) {
            setError('Không thể tải bình luận. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddReply = async (commentId: number, content: string) => {

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            await createReply(content, commentId, userId);
            await fetchComments(); // Refresh comments after adding reply
        } catch (err) {
            setError('Không thể thêm trả lời. Vui lòng thử lại sau.');
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (!newComment.trim()) return;

        try {
            await createComment(newComment, companyId, userId);
            setNewComment('');
            await fetchComments(); // Refresh comments after adding new comment
        } catch (err) {
            setError('Không thể thêm bình luận. Vui lòng thử lại sau.');
        }
    };

    if (loading) {
        return <div className="text-center py-4">Đang tải bình luận...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white rounded-xl shadow-sm flex flex-col flex-grow">
                <div className="p-6 flex-grow">
                    <h2 className="text-xl font-semibold text-gray-800">Bình luận</h2>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Cố định chiều cao và thêm thuộc tính cuộn cho danh sách bình luận */}
                    <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto flex-grow">
                        {comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                onAddReply={handleAddReply}
                                userId={userId}
                            />
                        ))}
                    </div>

                    <form onSubmit={handleSubmitComment} className="mt-6">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận của bạn..."
                                className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Bình luận
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default CommentCard;