import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ProtectedRoute from './components/protectedroute.jsx'
import ModalContainer from './components/ModalContainer.jsx'

import NotFound from './pages/notfound.jsx'

function Logout() {
  // 1. Clear the tokens from local storage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  // 2. Smoothly redirect without a hard page reload
  // replace={true} ensures they can't click "back" to enter the app while logged out
  return <Navigate to="/login" replace={true} />;
}

function RegisterAndLogout() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access_token');
  useEffect(() => {
    // If no access token exists, cleanly redirect to register without a page reload
    if (!accessToken) {
      navigate('/register', { replace: true });
    }
  }, [accessToken, navigate]);
  // If a token exists, render the Logout component to clean up storage
  if (accessToken) {
    return <Logout />;
  }
  // Render nothing while the useEffect redirect happens
  return null;
}


function App() {
  return (
    <>
      <Routes>
        
      </Routes>
      <ModalContainer />
    </>
  )
}

export default App
