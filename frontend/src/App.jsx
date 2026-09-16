import react, { useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

/* Import Pages from a file */
import Home from './pages/home.jsx'
import NotFound from './pages/notfound.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'

/* Import Images from a file */
import InvictusLogo from './assets/invictus.png'

/* Import components from a file */
import ProtectedRoute from './components/protectedroute.jsx'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'



/* Import Modules from a file */
import Axios from 'axios'

/* Define the App functions */
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      {/* React Router handles these changes instantly without talking to Django */}
      <Link to="/login">Go to Login</Link>
      <Link to="/notes">View My Notes</Link>
    </nav>
  );
}


function Logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    return <Logout />;
  } else {
    return <Register />;
  }
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/register';
  return <Navigate to="/register" />;
}

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
