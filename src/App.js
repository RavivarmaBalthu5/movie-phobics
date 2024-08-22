// src/App.js
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import './App.css'; // Import the CSS file for styling
import { fetchAllMovies, fetchMovies } from './services/movieService';
import MovieCard from './components/MovieCard';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);

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

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <div className="movie-results">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
    </div>
  );
};

export default App;
