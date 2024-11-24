import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovies, fetchMoviesWithPage, fetchTotalPages } from '../../services/movieService';
import MovieCard from './MovieCard';
import loadingIcon from '../../assets/loading.svg';
import '../../css/MoviesSection.css';
import '../../css/Common.css';

const MoviesSection = ({ searchQuery, toggleSearch, isSearchVisible }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

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
                if (!searchQuery) {
                    setMovies(await fetchMoviesWithPage(currentPage));
                } else {
                    setMovies(await fetchMovies(searchQuery));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        getMovies();
    }, [searchQuery, currentPage]);

    const handleMovieClick = (movie) => {
        if (isSearchVisible) {
            toggleSearch();
        }
        navigate(`/movies/${movie.id}`);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handlePageChange = (event) => {
        setCurrentPage(Number(event.target.value));
    };

    return (
        <div>
            <div className="movie-results">
                {loading ? (
                    <img src={loadingIcon} alt="loading" className="movie-loading" />
                ) : (
                    movies.length > 0 ? (
                        movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onClick={() => handleMovieClick(movie)}
                            />
                        ))
                    ) : (
                        <img src={loadingIcon} alt="loading" className="movie-loading" />
                    )
                )}
            </div>
            {searchQuery === '' && (
                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="button">
                        Previous
                    </button>
                    <select value={currentPage} onChange={handlePageChange}>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <option key={index} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleNextPage} disabled={totalPages === currentPage} className="button">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MoviesSection;
