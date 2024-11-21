import React, { useEffect, useState } from 'react';
import '../../css/MovieDetails.css';
import '../../css/Common.css';
import { YOUTUBE_BASE_URL } from '../../utils/configs';
import { getImageUrl, getYearFromDate } from '../../utils/utils';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import Rating from '../Common/Rating';

const MovieDetails = ({ isOpen, onClose, movie, videos }) => {
    const [filter, setFilter] = useState('');
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [isOpen]);

    if (!isOpen) return null;

    const handleContentClick = (event) => {
        event.stopPropagation();
    };

    // Extract unique video types for filters
    const filters = videos.length > 0 ? Array.from(new Set(videos.map(video => video.type))) : []
    const filteredVideos = videos.length > 0 && filter ? videos.filter(video => video.type === filter) : [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content scrollable" onClick={handleContentClick}>
                <button className="modal-close" onClick={onClose}>
                    <FontAwesomeIcon
                        className='icon'
                        icon={faTimes}
                    />
                </button>
                <div className="modal-main">
                    <div className="modal-left">
                        <img
                            src={getImageUrl(movie)}
                            alt={movie?.title}
                            className="modal-poster"
                        />
                        {/* <div className="movie-details-rating">
                            <Rating rating={Number(movie?.vote_average)} />
                        </div> */}
                    </div>
                    <div className="modal-right">
                        <h2 className="modal-title">{movie?.title} ({getYearFromDate(movie?.release_date)})</h2>
                        <h4 className="modal-original-title">({movie?.original_title})</h4>
                        <p className="modal-overview">{movie?.overview}</p>
                    </div>
                </div>

                <div className="modal-videos">
                    <div className="filter-tabs">
                        {filters.map((f, index) => (
                            <button key={index} onClick={() => setFilter(f)} className='button'>
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
