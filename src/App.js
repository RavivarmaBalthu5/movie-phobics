import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import './App.css'; // Import the CSS file for styling
import { fetchAllMovies, fetchMovies, fetchVideos } from './services/movieService';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [videoData, setVideoData] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  useEffect(() => {
    const getInitialMovies = async () => {
      const initialMovies = await fetchAllMovies(true);
      setMovies(initialMovies);
    };

    getInitialMovies();
  }, []);

  const handleSearchSubmit = async () => {
    if (searchQuery.trim() === '') return;

    const data = await fetchMovies(searchQuery);
    setMovies(data);
  };

  const handleOpenMovieDetails = async (movie) => {
    const videos = await fetchVideos(movie.id);
    setVideoData(videos);
    setSelectedMovie(movie);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedMovie(null);
    setVideoData([]);
  };

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <div className="movie-results">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.id} // Use movie.id as the key for better uniqueness
              movie={movie}
              onClick={() => handleOpenMovieDetails(movie)} // Pass a function reference
            />
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
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

export default App;
