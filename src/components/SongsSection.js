import React, { useEffect, useState } from 'react';
import { addNewTrack, deleteTrack, fetchTracks } from '../services/movieService';
import '../css/SongsSection.css';
import { fetchWithRetry } from '../utils/utils';
import { YOUTUBE_BASE_URL } from '../utils/configs';
import loadingIcon from '../assets/loading.svg';

const SongsSection = ({ titleClick, handleTitleClick }) => {
    const [embedded, setEmbedded] = useState([]);
    const [videoId, setVideoId] = useState('');
    const [trackTitle, setTrackTitle] = useState('');

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const response = await fetchWithRetry(fetchTracks, 'admin');
                setEmbedded(response);
            } catch (error) {
                console.error('Error fetching tracks after retries:', error);
            }
        };

        if (titleClick) {
            handleTitleClick(false);
        }
        fetchTrack();
    }, [titleClick, handleTitleClick]);

    const handleVideoIdChange = (e) => {
        setVideoId(e.target.value);
    };

    const handleTitleChange = (e) => {
        setTrackTitle(e.target.value);
    };

    const handleUpdateClick = async () => {
        if (!videoId || !trackTitle) {
            console.error('Video ID and track title are required');
            return;
        }
        try {
            const response = await addNewTrack("admin", videoId, trackTitle);
            setEmbedded(response);
            setVideoId('');
            setTrackTitle('');
        } catch (error) {
            console.error('Error updating video ID:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteTrack("admin", id);
            setEmbedded(response);
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    return (
        <div className="modal-videos">
            <div>
                <div>
                    <h3>Songs</h3>
                    <div className="update-section">
                        <input
                            type="text"
                            value={videoId}
                            onChange={handleVideoIdChange}
                            placeholder="Enter video ID"
                        />
                        <input
                            type="text"
                            value={trackTitle}
                            onChange={handleTitleChange}
                            placeholder="Enter track title"
                        />
                        <button onClick={handleUpdateClick}>Update</button>
                    </div>
                </div>

                <div className="video-container">
                    {embedded.length > 0 ? (
                        embedded.map((track) => (
                            <div key={track.id} className="video-item">
                                <div className="delete-section">
                                    <h3>{track?.title}</h3>
                                    <button onClick={() => handleDelete(track.id)}>Delete</button>
                                </div>
                                <iframe
                                    src={`${YOUTUBE_BASE_URL}/embed/${track.id}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={track.id}
                                    width="560"
                                    height="315"
                                ></iframe>
                            </div>
                        ))
                    ) : (
                        <div className="movie-loading-container">
                            <img src={loadingIcon} alt="loading" className="movie-loading" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SongsSection;
