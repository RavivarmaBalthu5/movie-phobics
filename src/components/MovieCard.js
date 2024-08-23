import React from 'react';
import '../css/MovieCard.css'; // Import CSS file for styling
import { IMG_BASE_URL } from '../utils/configs';

const MovieCard = ({ movie, onClick }) => {
    return (
        <div className="movie-card" onClick={onClick}>
            <img
                src={`${IMG_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                className="movie-card-image"
            />
            <div className="movie-card-info">
                <h3 className="movie-card-title">{movie.title}</h3>
                <p className="movie-card-year">{movie.release_date}</p>
            </div>
        </div>
    );
};

export default MovieCard;
