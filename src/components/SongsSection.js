import React, { useEffect, useState } from 'react';
import { addNewTrack, fetchTracks } from '../services/movieService';
import '../css/SongsSection.css'; // Import the CSS file
import { fetchWithRetry } from '../utils/utils';
import { YOUTUBE_BASE_URL } from '../utils/configs';
import loadingIcon from '../assets/loading.svg';

const SongsSection = ({ titleClick, handleTitleClick }) => {
    const [embedded, setEmbedded] = useState([]);
    const [videoId, setVideoId] = useState('');

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

    const handleUpdateClick = async () => {
        if (!videoId) {
            console.error('Video ID is required');
            return;
        }
        try {
            // Assuming updateVideoId is a function to update videoId in the backend
            const response = await addNewTrack("admin", videoId);
            // Optionally, fetch the updated list of tracks after update
            setEmbedded(response);
            setVideoId(''); // Clear input after successful update
        } catch (error) {
            console.error('Error updating video ID:', error);
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
                        <button onClick={handleUpdateClick}>Update Video ID</button>
                    </div>
                </div>

                <div className="video-container">
                    {embedded.length > 0 ? (
                        embedded.map((track) => (
                            <div key={track.id} className="video-item">
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
