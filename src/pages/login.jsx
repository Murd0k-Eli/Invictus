import Form from '../components/form.jsx'


function Login() {
    return (
        <div>
            <p>Please enter your credentials to log in.</p>
            <Form route="/api/token/" method="login" />
        </div>
    )
}

export default Login;