import React, { useEffect, useState } from 'react';
import { fetchTracks } from '../services/movieService';
import '../css/SongsSection.css'; // Import the CSS file
import { fetchWithRetry } from '../utils/utils';
import { YOUTUBE_BASE_URL } from '../utils/configs';

const SongsSection = ({ titleClick, handleTitleClick, searchQuery }) => {
    const [playlistId, setPlaylistId] = useState({});

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const response = await fetchWithRetry(fetchTracks, searchQuery);
                setPlaylistId(response);
            } catch (error) {
                console.error('Error fetching tracks after retries:', error);
            }
        };

        if (titleClick) {
            handleTitleClick(false);
        }
        fetchTrack();
    }, [titleClick, searchQuery, handleTitleClick]);

    return (
        <div className="modal-videos">
            {playlistId && (
                <div>
                    <h3>Songs</h3>
                    <div className="video-container">
                        <div key={playlistId._id} className="video-item">
                            <iframe
                                src={`${YOUTUBE_BASE_URL}/embed/videoseries?list=${playlistId.playlistId}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={playlistId?._id}
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SongsSection;
