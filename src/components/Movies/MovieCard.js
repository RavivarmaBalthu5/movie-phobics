import React from 'react';
import '../../css/MovieCard.css';
import { formatReleaseDate, getImageUrl } from '../../utils/utils';
import Rating from '../Common/Rating';

const MovieCard = ({ movie, onClick }) => {
    return (
        <div className="movie-card" onClick={onClick}>
            <div className="movie-card-image-container">
                <img
                    src={getImageUrl(movie)}
                    alt={movie?.title}
                    className="movie-card-image"
                />
                <div className="movie-card-overlay">
                    <div className="movie-card-rating">
                        <Rating rating={movie?.vote_average} />
                    </div>
                    <h3 className="movie-card-title">{movie?.title}</h3>
                    <p className="movie-card-year">{formatReleaseDate(movie?.release_date)}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
