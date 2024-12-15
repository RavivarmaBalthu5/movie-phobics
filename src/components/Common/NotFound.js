import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Common.css';

const NotFound = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);  // Go back to the previous page
    };

    const goHome = () => {
        navigate('/');  // Navigate to the homepage
    };

    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404 - Page Not Found</h1>
            <p className="not-found-message">Sorry, the page you are looking for does not exist.</p>
            <div className="not-found-actions">
                <button onClick={goBack} className="button">Go Back</button>
                <button onClick={goHome} className="button">Go to Homepage</button>
            </div>
        </div>
    );
};

export default NotFound;
