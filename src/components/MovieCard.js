import React from 'react';
import '../css/MovieCard.css';
import { formatReleaseDate, getImageUrl } from '../utils/utils';
import '../css/Common.css';
import Rating from './Rating';

const MovieCard = ({ movie, onClick }) => {

    return (
        <div className="movie-card" onClick={onClick}>
            <img
                src={getImageUrl(movie)}
                alt={movie?.title}
                className="movie-card-image"
            />
            <div className="movie-card-rating">
                <Rating rating={movie?.vote_average} />
            </div>
            <div className="movie-card-info">
                <h3 className="movie-card-title">{movie?.title}</h3>
                <p className="movie-card-year">{formatReleaseDate(movie?.release_date)}</p>
            </div>
        </div>
    );
};

export default MovieCard;
