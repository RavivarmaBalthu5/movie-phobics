import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/MovieDetails.css';
import '../../css/Common.css';
import { YOUTUBE_BASE_URL } from '../../utils/configs';
import { fetchMovieDetail, fetchVideos } from '../../services/movieService';
import { genreMap, getImageUrl, getYearFromDate, languageMapping } from '../../utils/utils';
import loadingIcon from '../../assets/loading.svg';
import _ from 'lodash';
import MovieNotFound from './MovieNotFound';

const MovieDetails = () => {
    const { id } = useParams(); // Get movie ID from the route
    const [movie, setMovie] = useState(null);
    const [videos, setVideos] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getMovieDetails = async () => {
            try {
                const movieData = await fetchMovieDetail(id);
                const videoData = await fetchVideos(id);
                setMovie(movieData);
                setVideos(videoData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        getMovieDetails();
    }, [id]);

    if (loading) return <img src={loadingIcon} alt="loading" className="movie-loading" />;
    if (!movie) return <MovieNotFound />;

    // Handle genres
    const genreNames = movie?.genre_ids?.map((genreId) => {
        return genreMap[genreId];
    });

    // Filters for videos based on video type
    const filters = videos.length > 0 ? Array.from(new Set(videos.map(video => video.type))) : [];
    const filteredVideos = videos.length > 0 && filter ? videos.filter(video => video.type === filter) : [];

    return (
        <div className="movie-details-container" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})` }}>
            <div className="movie-main">
                <div className="movie-left">
                    <img
                        src={getImageUrl(movie)}
                        alt={movie?.original_title}
                        className="movie-poster"
                    />
                </div>
                <div className="movie-right">
                    <h2>{movie?.title} {movie?.original_language !== 'en' ?
                        <span>({movie?.original_title})</span> : ''}
                        ({getYearFromDate(movie?.release_date)})</h2>
                    <div className="movie-info">
                        <div className="info-item">
                            <strong>Overview:</strong><span>{movie?.overview}</span>
                        </div>
                        <div className="info-item">
                            <strong>Genres:</strong> <span>{!_.isEmpty(genreNames) ? (genreNames)?.join(', ') : 'Unknown'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Release Date:</strong> <p>{new Date(movie.release_date).toLocaleDateString()}</p>
                        </div>
                        <div className="info-item">
                            <strong>Rating:</strong> <p>{movie?.vote_average} ({movie?.vote_count} votes)</p>
                        </div>
                        <div className="info-item">
                            <strong>Popularity:</strong> <p>{movie?.popularity}</p>
                        </div>
                        <div className="info-item">
                            <strong>Original Language:</strong> <p>{languageMapping[movie?.original_language]}</p>
                        </div>
                    </div>
                    <div className="filter-tabs">
                        {filters.map((f, index) => (
                            <button key={index} onClick={() => setFilter(f)} className="button">
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="movie-videos">
                <div className="video-list">
                    {filteredVideos.map((video, index) => (
                        <div key={index} className="video-item">
                            <iframe
                                src={`${YOUTUBE_BASE_URL}/embed/${video.key}`}
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={video.name}
                            ></iframe>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
