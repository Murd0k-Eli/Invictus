import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../styles/ModalContainer.css';
import Login from '../pages/notfound.jsx';
import Register from '../pages/notfound.jsx';
const ModalContainer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('login');

    useEffect(() => {
        const handleOpenModal = (event) => {
            setMode(event.detail?.mode || 'login');
            setIsOpen(true);
        };

        window.addEventListener('open-auth-modal', handleOpenModal);
        console.log('Inside the Modal Container Hook.');

        return () => window.removeEventListener('open-auth-modal', handleOpenModal);
    }, []);

    if (!isOpen) return null;

    const modalRoot = document.getElementById('react-modal-root');
    if (!modalRoot) return null;

    return createPortal(
        <div className="modal-overlay fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
            <div className="modal-content relative w-full max-w-360px h-fit bg-white rounded-2xl shadow-xl p-6 flex flex-col pointer-events-auto" style={{ width: '424px' }} onClick={(e) => e.stopPropagation()}>
                <button className="close-button absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none focus:outline-none" onClick={() => setIsOpen(false)}>&times;</button>
                <div>
                    {mode === 'login' ? <Login /> : <Register />}
                </div>
            </div>
        </div>,
        modalRoot
    );
};

export default ModalContainer;