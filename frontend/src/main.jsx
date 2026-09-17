import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App.jsx'
import ModalContainer from './components/ModalContainer';
//import './style.css'

// Your application JavaScript logic goes here
console.log("Invictus Modals Loaded!");

const rootElement = document.getElementById('react-modal-root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <ModalContainer />
        </React.StrictMode>
    )
}