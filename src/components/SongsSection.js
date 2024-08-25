import React, { useEffect, useState } from 'react';
import SpotifyEmbed from './SpotifyEmbed';
import { fetchTracks } from '../services/movieService';
import '../css/SongsSection.css'; // Import the CSS file

const SongsSection = ({ searchQuery }) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const fetchTrack = async () => {
            if (searchQuery) {
                try {
                    const response = await fetchTracks(searchQuery);
                    setTracks(response);
                } catch (error) {
                    console.error('Error fetching tracks:', error);
                }
            }
        };
        fetchTrack();
    }, [searchQuery]);

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
