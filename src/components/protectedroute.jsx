import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import {ACCESS_TOKEN} from '../constants';
import { REFRESH_TOKEN } from '../constants';
import { useEffect, useState } from 'react';

function ProtectedRoute({ children }) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const refreshAccessToken = async () => {
        try {
            const response = await api.post('/token/refresh/', { refresh: refreshToken });
            if (response.status !== 200) {
                throw new Error('Failed to refresh access token');
                setIsAuthenticated(false);
            }
            else {
                console.log('Access token refreshed successfully');
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthenticated(true);
            }

            const newAccessToken = response.data.access;
            localStorage.setItem(ACCESS_TOKEN, newAccessToken);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Refresh token error:', error);
            setIsAuthenticated(false);
        }
    };
    const authenticateUser = async () => {
        if (!accessToken) {
            setIsAuthenticated(false);
            return <Navigate to="/login" />;
        }
        try {
            const decodedToken = jwtDecode(accessToken);
            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedToken.exp < currentTime) {
                // Token has expired
                await refreshAccessToken();
            } else {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            setIsAuthenticated(false);
        }
    };
    useEffect(() => {
        authenticateUser().catch((error) => {
            console.error('Error during authentication:', error);
            setIsAuthenticated(false);
        });
    }, []);
    const checkAuthentication = () => {
        if (!accessToken) {
            setIsAuthenticated(false);
            return <Navigate to="/login" />;
        }
    }
    const isTokenExpired = () => {
        if (!accessToken) {
            return true;
        }
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
            // Token has expired
            return <Navigate to="/login" />;
        }
        return decodedToken.exp < currentTime;
    };
    if (isAuthenticated === null) {
        checkAuthentication();
        if (isTokenExpired()) {
            refreshAccessToken();
        } else {
            setIsAuthenticated(true);
        }
    }
    else if (isAuthenticated === false) {
        return <Navigate to="/login" />;
    }
    else if (isAuthenticated === true) {
        if (isTokenExpired()) {
            refreshAccessToken();
        }
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;