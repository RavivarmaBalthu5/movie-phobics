import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Common.css';

const MovieNotFound = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');  // Navigate to the homepage
    };

    return (
        <div className="movie-not-found-container">
            <h1 className="movie-not-found-title">Movie Not Found</h1>
            <p className="movie-not-found-message">Sorry, we couldn't find the movie you are looking for.</p>
            <div className="movie-not-found-actions">
                <button onClick={goHome} className="button">Go to Homepage</button>
            </div>
        </div>
    );
};

export default MovieNotFound;
