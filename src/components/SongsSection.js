import React, { useEffect, useState } from 'react';
import SpotifyEmbed from './SpotifyEmbed';
import { fetchTracks } from '../services/movieService';
import '../css/SongsSection.css'; // Import the CSS file

const SongsSection = ({ titleClick, handleTitleClick, searchQuery }) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                if(searchQuery){
                  const response = await fetchTracks(searchQuery);
       
                setTracks(response);
                }
            } catch (error) {
                console.error('Error fetching tracks:', error);
            }
        };
        if (titleClick) {
            handleTitleClick(false);
        }
        fetchTrack();
    }, [titleClick, searchQuery, handleTitleClick]);

    return (
        <div className="songs-section">
            {tracks.length > 0 ? (
                tracks.map(track => (
                    <SpotifyEmbed key={track.id} trackUri={track.uri} className="spotify-embed" />
                ))
            ) : (
                <p className="no-tracks-message">No tracks found</p>
            )}
        </div>
    );
};

export default SongsSection;
