import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import BlogPostForm from './components/BlogPostForm.jsx'
import CommentSection from './components/CommentSection.jsx'
import Notes from './components/notes.jsx'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}

const blogFormElement = document.getElementById('blog-form-root')
if (blogFormElement) {
  ReactDOM.createRoot(blogFormElement).render(
    <React.StrictMode>
      <BlogPostForm />
    </React.StrictMode>
  )
}

const commentSectionElement = document.getElementById('comment-section-root')
if (commentSectionElement) {
    // We need the article ID from the URL to pass to the CommentSection
    const pathParts = window.location.pathname.split('/');
    // URL is usually /blog/<id>/
    const articleId = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1];
    
    ReactDOM.createRoot(commentSectionElement).render(
        <React.StrictMode>
            <CommentSection articleId={articleId} />
        </React.StrictMode>
    );
}

const notesElement = document.getElementById('notes-root')
if (notesElement) {
    ReactDOM.createRoot(notesElement).render(
        <React.StrictMode>
            <Notes />
        </React.StrictMode>
    );
}