import React, { useEffect, useState } from 'react';
import '../../css/Auth.css';
import { auth } from '../../services/authService';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                const { loginTime } = userData;
                const now = Date.now();
                const THIRTY_MINUTES = 30 * 60 * 1000;

                if (now - loginTime < THIRTY_MINUTES) {
                    // Still valid session
                    window.location.href = '/movies';
                } else {
                    // Expired session
                    localStorage.removeItem('user');
                }
            } catch {
                localStorage.removeItem('user');
            }
        }
    }, []);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError("All fields are required.");
            return;
        }

        try {
            let response = await auth("login", formData.email, formData.password)

            if (response) {
                setSuccess('Login successful!');
                const sessionData = {
                    ...response,
                    loginTime: Date.now()
                };
                localStorage.setItem('user', JSON.stringify(sessionData));
                window.location.href = '/movies';
            } else {
                setError('Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
