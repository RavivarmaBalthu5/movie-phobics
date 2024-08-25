// src/components/MovieDetails.js
import React from 'react';
import '../css/MovieDetails.css'; // Import the CSS file for styling
import { IMG_BASE_URL, YOUTUBE_BASE_URL } from '../utils/configs'; // Import IMG_BASE_URL for image paths

const MovieDetails = ({ isOpen, onClose, movie, videos }) => {
    if (!isOpen) return null;

    const handleContentClick = (event) => {
        event.stopPropagation();
    };

    // Separate trailers and other videos
    const trailers = videos.length > 0 ? videos.filter(video => video.type === 'Trailer').slice(0, 4) : [];
    const otherVideos = videos.length > 0 ? videos.filter(video => video.type !== 'Trailer').slice(0, 4) : [];



    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close" onClick={onClose}>X</button>
                <div className="modal-main">
                    <div className="modal-left">
                        <img
                            src={`${IMG_BASE_URL}${movie?.poster_path}`}
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
                    {trailers?.length > 0 && (
                        <div>
                            <h3>Trailers</h3>
                            <div className="video-container">
                                {trailers?.map((video, index) => (
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
                    {otherVideos?.length > 0 && (
                        <div>
                            <h3>Other Videos</h3>
                            <div className="video-container">
                                {otherVideos?.map((video, index) => (
                                    <div key={index} className="video-item">
                                        <iframe
                                            src={`${YOUTUBE_BASE_URL}/embed/${video?.key}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
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
