import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/MovieDetails.css';
import '../../css/Common.css';
import { YOUTUBE_BASE_URL } from '../../utils/configs';
import { fetchMovieDetail, fetchVideos } from '../../services/movieService';
import { getImageUrl, getYearFromDate } from '../../utils/utils';
import loadingIcon from '../../assets/loading.svg';

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

    if (loading) return <img src={loadingIcon} alt="loading" className="movie-loading" />
    if (!movie) return <div>Movie not found</div>;

    const filters = videos.length > 0 ? Array.from(new Set(videos.map(video => video.type))) : [];
    const filteredVideos = videos.length > 0 && filter ? videos.filter(video => video.type === filter) : [];

    return (
        <div className="movie-details-container">
            <div className="movie-main">
                <div className="movie-left">
                    <img
                        src={getImageUrl(movie)}
                        alt={movie?.title}
                        className="movie-poster"
                    />
                </div>
                <div className="movie-right">
                    <h2>{movie?.title} ({getYearFromDate(movie?.release_date)})</h2>
                    <p>{movie?.overview}</p>
                </div>
            </div>

            <div className="movie-videos">
                <div className="filter-tabs">
                    {filters.map((f, index) => (
                        <button key={index} onClick={() => setFilter(f)} className="button">
                            {f}
                        </button>
                    ))}
                </div>
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
