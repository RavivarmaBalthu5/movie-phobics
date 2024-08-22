// src/components/MovieCard.js
import React from 'react';
import '../css/MovieCard.css'; // Import CSS file for styling

const MovieCard = ({ movie }) => {
    return (
        <div className="movie-card">
            <img
                src={movie.image}
                alt={movie.title}
                className="movie-card-image"
            />
            <div className="movie-card-info">
                <h3 className="movie-card-title">{movie.title}</h3>
                <p className="movie-card-year">{movie.year}</p>
            </div>
        </div>
    );
};

export default MovieCard;
