import React, { useEffect, useState } from 'react';
import { fetchMovies, fetchMoviesWithPage, fetchTotalPages, fetchVideos } from '../services/movieService';
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
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const getTotalPages = async () => {
            try {
                const pages = await fetchTotalPages();
                setTotalPages(pages);
            } catch (e) {
                console.error(e);
            }
        };

        getTotalPages();
    }, []);
    useEffect(() => {
        const getMovies = async () => {
            setLoading(true);
            try {
                if (searchQuery.trim() === '') {
                    setMovies(await fetchMoviesWithPage(currentPage))
                } else {
                    setMovies(await fetchMovies(searchQuery))
                }
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
    }, [titleClick, searchQuery, handleTitleClick, currentPage]);
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

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
    };
    const handlePageChange = (event) => {
        setCurrentPage(Number(event.target.value));
    };

    return (
        <div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <select value={currentPage} onChange={handlePageChange}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
                <button onClick={handleNextPage} disabled={totalPages === currentPage}>
                    Next
                </button>
            </div>
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
        </div>
    );
};

export default MoviesSection;
