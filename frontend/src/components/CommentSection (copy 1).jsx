import React, { useState } from 'react';
import { api } from '../api';
import { IonIcon } from 'react-ionicons';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/api/comments/delete/${commentId}/`);
            await fetchComments();
        } catch (err) {
            console.error('Error deleting comment:', err);
            alert('Failed to delete comment. You might not have permission.');
        }
    };

    const fetchComments = async () => {
        try {
            const response = await api.get(`/api/comments/${postId}/`);
            setComments(response.data);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError('Failed to fetch comments.');
        }
    };

    fetchComments();

    return (
        <div className="comments-section">
            <h3>Comments</h3>
            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="text-muted italic">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment-item mb-3 p-3 border rounded-3 bg-light">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold text-primary">{comment.user}</span>
                                    <button 
                                        onClick={() => handleDeleteComment(comment.id)} 
                                        className="btn btn-sm btn-outline-danger py-0 px-1" 
                                        style={{ fontSize: '0.7rem', lineHeight: '1' }}
                                        title="Delete comment"
                                    >
                                        <ion-icon name="trash-outline"></ion-icon>
                                    </button>
                                </div>
                                <span className="text-muted small">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className, "mb-0 text-dark">{comment.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;