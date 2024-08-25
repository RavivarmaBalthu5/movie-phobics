import React, { useEffect, useState } from 'react';
import { fetchAllMovies, fetchMovies, fetchVideos } from '../services/movieService';
import MovieCard from './MovieCard';
import MovieDetails from './MovieDetails';
import loadingIcon from '../assets/loading.svg';
import '../css/MoviesSection.css';

const MoviesSection = ({ titleClick, handleTitleClick, searchQuery }) => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [videoData, setVideoData] = useState([]);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getMovies = async () => {
            setLoading(true);
            try {
                const data = searchQuery.trim() === ''
                    ? await fetchAllMovies(true)
                    : await fetchMovies(searchQuery);
                setMovies(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        getMovies();
        if (titleClick) {
            handleTitleClick(false);
        }
    }, [titleClick, searchQuery, handleTitleClick]);

    const handleOpenMovieDetails = async (movie) => {
        setLoading(true);
        try {
            const videos = await fetchVideos(movie.id);
            setVideoData(videos);
            setIsDetailsOpen(true);
            setSelectedMovie(movie);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedMovie(null);
        setVideoData([]);
    };

    return (
        <div className="movie-results">
            {loading ? (
                <img src={loadingIcon} alt="loading" className="movie-loading" />
            ) : (
                movies.length > 0 ?
                    movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onClick={() => handleOpenMovieDetails(movie)}
                        />
                    )) : <img src={loadingIcon} alt="loading" className="movie-loading" />
            )}
            {isDetailsOpen && selectedMovie && (
                <MovieDetails
                    isOpen={isDetailsOpen}
                    onClose={handleCloseDetails}
                    movie={selectedMovie}
                    videos={videoData}
                />
            )}
        </div>
    );
};

export default MoviesSection;
