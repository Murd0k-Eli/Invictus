import {useState, useEffect} from 'react'
import api from '../api'
import {useNavigate} from 'react-router-dom'
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants'
import '../styles/form.css'
import LoadingIndicator from "./LoadingIndicator"

function Form({route, method}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === 'login' ? 'Login' : 'Register'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await api.post(route, {username,password})
            if (method === 'login') {
                alert('Login successful!')
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh)
                navigate('/')
            } else {
                alert('An error occurred. Please try again later.')
                setError('Invalid username or password')
                navigate('/login')
            }
        } catch (err) {
            alert('An error occurred. Please try again later.')
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
        {error && <div style={{color: 'red'}}>{error}</div>}
        {loading && <div>Loading...</div>}
        {loading && <Loading Indicator />}
        <button className="form-button" type="submit" disabled={loading}>
            {name} 
        </button>
    </form>
    );
}

export default Form