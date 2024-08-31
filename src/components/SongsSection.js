import React, { useEffect, useState, useRef, useCallback } from 'react';
import { addNewTrack, deleteTrack, fetchTracks } from '../services/movieService';
import '../css/SongsSection.css';
import { fetchWithRetry } from '../utils/utils';
import { YOUTUBE_BASE_URL } from '../utils/configs';
import loadingIcon from '../assets/loading.svg';

const SongsSection = ({ titleClick, handleTitleClick }) => {
    const [embedded, setEmbedded] = useState([]);
    const [videoId, setVideoId] = useState('');
    const [trackTitle, setTrackTitle] = useState('');
    const [playing, setPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const playerRef = useRef(null);
    const player = useRef(null);

    const playNextVideo = useCallback(() => {
        console.log('Playing next video');
        setCurrentIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % embedded.length;
            console.log('Next video index:', nextIndex);
            if (player.current) {
                console.log('Loading video ID:', embedded[nextIndex].id);
                player.current.loadVideoById(embedded[nextIndex].id);
                player.current.playVideo();
            } else {
                console.error('Player instance is not available');
            }
            return nextIndex;
        });
    }, [embedded]);

    const initializePlayer = useCallback((videoId) => {
        console.log('Initializing player with video ID:', videoId);
        if (!window.YT) {
            console.error('YouTube API is not loaded');
            return;
        }

        if (!playerRef.current) {
            console.error('YouTube player element ref is not set');
            return;
        }

        player.current = new window.YT.Player(playerRef.current, {
            height: '350',
            width: '560',
            videoId: videoId,
            events: {
                'onReady': () => {
                    console.log('Player is ready');
                    if (playing) {
                        player.current.playVideo();
                    }
                },
                'onStateChange': (event) => {
                    console.log('Player state changed:', event.data);
                    if (event.data === window.YT.PlayerState.ENDED) {
                        playNextVideo();
                    }
                }
            }
        });
    }, [playing, playNextVideo]);

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const response = await fetchWithRetry(fetchTracks, 'admin');
                setEmbedded(response);
                if (response.length > 0 && !player.current) {
                    initializePlayer(response[0].id);
                }
            } catch (error) {
                console.error('Error fetching tracks:', error);
            }
        };

        if (titleClick) {
            handleTitleClick(false);
        }
        fetchTrack();
    }, [titleClick, handleTitleClick, initializePlayer]);

    useEffect(() => {
        if (!window.YT) {
            const script = document.createElement('script');
            script.src = `${YOUTUBE_BASE_URL}/iframe_api`;
            script.onload = () => {
                window.YT.ready(() => {
                    if (embedded.length > 0 && !player.current) {
                        initializePlayer(embedded[0].id);
                    }
                });
            };
            document.body.appendChild(script);
        } else if (embedded.length > 0 && !player.current) {
            initializePlayer(embedded[0].id);
        }
    }, [embedded, initializePlayer]);

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

    const togglePlayPause = () => {
        if (player.current) {
            if (playing) {
                player.current.pauseVideo();
            } else {
                player.current.playVideo();
            }
            setPlaying(!playing);
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
                        <button onClick={togglePlayPause}>
                            {playing ? 'Pause' : 'Play'}
                        </button>
                    </div>
                </div>

                <div className="video-container">
                    {embedded.length > 0 ? (
                        <div ref={playerRef} id="player" />
                    ) : (
                        <div className="movie-loading-container">
                            <img src={loadingIcon} alt="loading" className="movie-loading" />
                        </div>
                    )}
                </div>

                <div className="song-list">
                    {embedded.length > 0 ? (
                        <ul>
                            {embedded.map((track, index) => (
                                <li
                                    key={track.id}
                                    style={{
                                        backgroundColor: index === currentIndex ? '#d3d3d3' : 'transparent',
                                        padding: '10px',
                                        margin: '5px 0',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {track.title}
                                    <button
                                        onClick={() => {
                                            setCurrentIndex(index);
                                            if (player.current) {
                                                player.current.loadVideoById(track.id);
                                                player.current.playVideo();
                                            } else {
                                                console.error('Player instance is not available');
                                            }
                                        }}
                                        style={{
                                            float: 'right',
                                            backgroundColor: '#4CAF50',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            padding: '5px 10px',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        Play
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(track.id);
                                        }}
                                        style={{
                                            float: 'right',
                                            backgroundColor: '#ff0000',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            padding: '5px 10px'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
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
