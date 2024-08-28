import React, { useEffect, useState } from 'react';
import { fetchTracks } from '../services/movieService';
import '../css/SongsSection.css'; // Import the CSS file
import { fetchWithRetry } from '../utils/utils';
import { YOUTUBE_BASE_URL } from '../utils/configs';

const SongsSection = ({ titleClick, handleTitleClick, searchQuery }) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const fetchTrack = async () => {
            let query = searchQuery ? searchQuery : 'telugu';
            try {
                const response = await fetchWithRetry(fetchTracks, query);
                setTracks(response);
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
            {tracks?.length > 0 && (
                <div>
                    <h3>Songs</h3>
                    <div className="video-container">
                        {tracks?.map((track, index) => (
                            <div key={index} className="video-item">
                                <iframe
                                    src={`${YOUTUBE_BASE_URL}/embed/${track._id}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={track?.title}
                                ></iframe>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SongsSection;
