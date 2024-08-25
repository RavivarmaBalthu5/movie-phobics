import React from 'react';

const SpotifyEmbed = ({ trackUri }) => {
    const trackId = trackUri.split(':').pop(); // Extract track ID from URI
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;

    return (
        <div>
            <iframe
                src={embedUrl}
                width="300"
                height="380"
                frameBorder="0"
                allowTransparency="true"
                allow="encrypted-media"
                title="Spotify Track Player"
            ></iframe>
        </div>
    );
};

export default SpotifyEmbed;
