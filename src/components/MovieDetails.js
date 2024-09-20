import React, { useState } from 'react';
import '../css/MovieDetails.css';
import { YOUTUBE_BASE_URL } from '../utils/configs';
import { getImageUrl } from '../utils/utils';

const MovieDetails = ({ isOpen, onClose, movie, videos }) => {
    const [filter, setFilter] = useState('');
    if (!isOpen) return null;

    const handleContentClick = (event) => {
        event.stopPropagation();
    };

    // Extract unique video types for filters
    const filters = Array.from(new Set(videos.map(video => video.type)));
    const filteredVideos = videos.length > 0 && filter ? videos.filter(video => video.type === filter) : [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close" onClick={onClose}>X</button>
                <div className="modal-main">
                    <div className="modal-left">
                        <img
                            src={getImageUrl(movie)}
                            alt={movie?.title}
                            className="modal-poster"
                        />
                    </div>
                    <div className="modal-right">
                        <h2 className="modal-title">{movie?.title}</h2>
                        <p className="modal-release-date">Release Date: {movie?.release_date}</p>
                        <p className="modal-vote-average">Rating: {movie?.vote_average}</p>
                        <p className="modal-overview">{movie?.overview}</p>
                    </div>
                </div>

                <div className="modal-videos">
                    <div className="filter-tabs">
                        {filters.map((f, index) => (
                            <button key={index} onClick={() => setFilter(f)}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    {filteredVideos.length > 0 && (
                        <div>
                            <div className="video-container">
                                {filteredVideos.map((video, index) => (
                                    <div key={index} className="video-item">
                                        <iframe
                                            src={`${YOUTUBE_BASE_URL}/embed/${video.key}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={video?.name}
                                        ></iframe>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
