import React, { useState } from 'react';
import api from '../api';
import '../styles/form.css';

const BlogPostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await api.post('/api/articles/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage({ type: 'success', text: 'Blog post created successfully!' });
            setTitle('');
            setContent('');
            setImage(null);
        } catch (error) {
            console.error('Error creating blog post:', error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.detail || 'An error occurred while creating the post.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blog-post-form-container">
            <h2>Create a New Blog Post</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input 
                        type="text" 
                        id="title" 
                        className="form-input"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Enter post title" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea 
                        id="content" 
                        className="form-input"
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        placeholder="Write your content here..." 
                        required 
                        rows="10"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Featured Image</label>
                    <input 
                        type="file" 
                        id="image" 
                        className="form-input"
                        onChange={(e) => setImage(e.target.files[0])} 
                        accept="image/*"
                    />
                </div>
                <button type="submit" className="form-button" disabled={loading}>
                    {loading ? 'Posting...' : 'Publish Post'}
                </button>
                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default BlogPostForm;
