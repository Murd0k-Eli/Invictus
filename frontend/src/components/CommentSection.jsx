import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/form.css';

const CommentSection = ({ articleId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
            const response = await api.get(`/api/articles/${articleId}/comments/`);
            setComments(response.data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [articleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        setError('');

        try {
            await api.post(`/api/articles/${articleId}/comments/`, {
                text: newComment
            });
            setNewComment('');
            await fetchComments();
        } catch (err) {
            console.error('Error posting comment:', err);
            setError(err.response?.data?.detail || 'Failed to post comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="comment-section" style={{ marginTop: '3rem', padding: '2rem 0', borderTop: '1px solid #eee' }}>
            <h3 className="fw-bold mb-4">Comments ({comments.length})</h3>
            
            <form onSubmit={handleSubmit} className="comment-form mb-5">
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <textarea 
                        className="form-control" 
                        placeholder="Add a comment..." 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                        rows="3"
                        style={{ borderRadius: '12px', padding: '12px' }}
                    />
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                            {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </div>
                {error && <div className="text-danger small mt-2">{error}</div>}
            </form>

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
                            <p className="mb-0 text-dark">{comment.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
