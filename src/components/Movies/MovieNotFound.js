import React from 'react';
import '../../css/Common.css';

const MovieNotFound = () => {

    const goHome = () => {
        window.location.href = "/movies"
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
