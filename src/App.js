import React, { useState } from 'react';
import Header from './components/Header';
import MoviesSection from './components/MoviesSection';
import SongsSection from './components/SongsSection'; // Import SongsSection if you have it
import './App.css';

const App = () => {
  const [titleClick, setTitleClick] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSongSearch, setIsSongSearch] = useState(false); // New state for search type


  const handleTitleClick = (value) => {
    setSearchQuery('');
    setTitleClick(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery();
  };

  const handleToggleChange = () => {
    setIsSongSearch(!isSongSearch); // Toggle between songs and movies
    setSearchQuery('');
  };

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onTitleClick={() => handleTitleClick(true)}
        onToggleChange={handleToggleChange} // Pass toggle handler
        isSongSearch={isSongSearch} // Pass search type state
      />
      {isSongSearch ? (
        <SongsSection searchQuery={searchQuery} handleTitleClick={handleTitleClick} /> // Render SongsSection
      ) : (
        <MoviesSection
          titleClick={titleClick}
          handleTitleClick={handleTitleClick}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

export default App;
