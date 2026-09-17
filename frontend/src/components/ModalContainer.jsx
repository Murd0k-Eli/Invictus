import React, { useState, useEffect } from 'react';
import Login from '../pages/login';
import Register from '../pages/register';
import '../styles/ModalContainer.css'; // We will create this next
import { createPortal } from 'react-dom';

const ModalContainer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('login'); // 'login' or 'signup'

    useEffect(() => {
        const handleOpenModal = (event) => {
            setMode(event.detail.mode || 'login');
            setIsOpen(true);
        };

        window.addEventListener('open-auth-modal', handleOpenModal);
        return () => window.removeEventListener('open-auth-modal', handleOpenModal);
    }, []);

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={() => setIsOpen(false)}>&times;</button>
                {mode === 'login' ? <Login /> : <Register />}
            </div>
        </div>,
        document.getElementById('react-modal-root')
    );
};

export default ModalContainer;