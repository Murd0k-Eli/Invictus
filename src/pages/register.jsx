import Form from '../components/form.jsx'


const Register = () => {
    return (
        <div>
            <h1>Register Page</h1>
            <p>Please fill in the form to create an account.</p>
            <Form route="/api/user/register/" method="register" />
        </div>
    )
};

export default Register;