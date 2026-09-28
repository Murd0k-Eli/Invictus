import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import BlogPostForm from './components/BlogPostForm.jsx'

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