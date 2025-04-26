import React, { useState } from 'react';
import '../../css/Auth.css';
import { auth } from '../../services/authService';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Password rules
    const passwordRules = {
        minLength: formData.password.length >= 8,
        hasUppercase: /[A-Z]/.test(formData.password),
        hasNumber: /[0-9]/.test(formData.password),
        hasSpecialChar: /[^A-Za-z0-9]/.test(formData.password)
    };

    const isPasswordValid = Object.values(passwordRules).every(Boolean);

    const handleChange = (e) => {
        setError('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.email || !formData.password) {
            setError("All fields are required.");
            return;
        }

        if (!isPasswordValid) {
            setError("Password does not meet all the requirements.");
            return;
        }

        try {
            const response = await auth('signup', formData.email, formData.password, formData.name);

            if (response) {
                setSuccess('Signup successful! Please log in.');
                window.location.href = '/movies';
            } else {
                setError('Signup failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Sign Up</h2>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={formData.name}
                required
            />
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
            <div className="password-rules">
                <small className={passwordRules.minLength ? 'valid' : ''}>
                    Minimum 8 characters
                </small>
                <small className={passwordRules.hasUppercase ? 'valid' : ''}>
                    At least one uppercase letter
                </small>
                <small className={passwordRules.hasNumber ? 'valid' : ''}>
                    At least one number
                </small>
                <small className={passwordRules.hasSpecialChar ? 'valid' : ''}>
                    At least one special character (e.g. !@#$)
                </small>
            </div>

            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
