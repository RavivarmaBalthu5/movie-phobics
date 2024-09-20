import React from 'react';
import '../css/MovieCard.css'; // Import CSS file for styling
import { getImageUrl } from '../utils/utils';

const MovieCard = ({ movie, onClick }) => {

    return (
        <div className="movie-card" onClick={onClick}>
            <img
                src={getImageUrl(movie)}
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
