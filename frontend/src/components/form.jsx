import {useState, useEffect} from 'react'
import api from '../api'
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants'
import '../styles/form.css'
import LoadingIndicator from "./LoadingIndicator"

function Form({route, method}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const redirectToDjangoRoute = (path) => {
        window.location.assign(path)
    }

    const name = method === 'login' ? 'Login' : 'Register'
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        // Create a multipart form payload
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        if (method === 'register') {
            formData.append('email', email);
            formData.append('confirm_password', confirmPassword);
        }
        try {
            console.log("Sending API request")
            const response = await api.post(route, formData)
            if (method === 'login') {
                alert('Login successful!')
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh)
                const token = response.data.access;
                redirectToDjangoRoute(`/api/auth/session-bridge/?token=${token}`);
                //redirectToDjangoRoute('/')
            } else {
                alert('Registration successful. Please sign in.')
                redirectToDjangoRoute('/accounts/login/')
            }
        } catch (err) {
            alert('An error occurred. Please try again later.')
            if (err.response) {
            // Django field errors live here
                console.log("Validation details:", err.response.data); 
            }
            setError('Invalid username or password')
        } finally {
            setLoading(false)
        }
    }
    return (<form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <div>
            <label htmlFor="username">Username:</label>
            <input 
                type="text" 
                className="form-input"
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter your username"
                required />
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <input 
            type="password" 
            className="form-input" 
            id="password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password"
            required />
        </div>
        {method === 'register' && (
            <>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        className="form-input" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Enter your email"
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input 
                        type="password" 
                        className="form-input" 
                        id="confirmPassword" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder="Confirm your password"
                        required 
                    />
                </div>
            </>
        )}
        {error && <div style={{color: 'red'}}>{error}</div>}
        {loading && <div>Loading...</div>}
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit" disabled={loading}>
            {name} 
        </button>

        <div style={{
            marginTop: '20px',
            width: '100%',
            textAlign: 'center',
            borderTop: '1px solid #eee',
            paddingTop: '20px'
        }}>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '15px' }}>Or continue with</p>
            <button 
                type="button" 
                onClick={() => window.location.href = 'https://spearfish-oil-wrinkle.ngrok-free.dev/accounts/google/login/'}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#fff',
                    color: '#757575',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f8f8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
                <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google" 
                    style={{ width: '18px', height: '18px' }} 
                />
                Sign in with Google
            </button>
        </div>
    </form>
    );
}

export default Form