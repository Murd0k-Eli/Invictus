import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../styles/ModalContainer.css';
import Form from './form.jsx';
import BlogPostForm from './BlogPostForm.jsx';
const ModalContainer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('login');
    useEffect(() => {
        const handleOpenModal = (event) => {
            setMode(event.detail?.mode || 'login');
            setIsOpen(true);
        };
        window.addEventListener('open-auth-modal', handleOpenModal);
        window.addEventListener('open-blog-modal', handleOpenModal);
        return () => {
            window.removeEventListener('open-auth-modal', handleOpenModal);
            window.removeEventListener('open-blog-modal', handleOpenModal);
        };
    }, []);
    if (!isOpen) return null;
    const modalRoot = document.getElementById('react-modal-root');
    if (!modalRoot) return null;
    return createPortal(
        <div className="modal-overlay fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
            <div className="modal-content relative w-full h-fit max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-4 flex flex-col pointer-events-auto" style={{ maxWidth: mode === 'blog' ? '500px' : '380px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                <button className="close-button absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none focus:outline-none" onClick={() => setIsOpen(false)}>&times;</button>
                <div className="modal-body w-full">
                    {mode === 'login' ?  (<Form route="/api/token/" method="login" />): 
                     mode === 'register' ? (<Form route="/api/user/register/" method="register" />):
                     mode === 'blog' ? (<BlogPostForm />): null}
                </div>
            </div>
        </div>,
        modalRoot
    );
};

export default ModalContainer;