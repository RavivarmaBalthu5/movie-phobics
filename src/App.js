import React, { useState } from 'react';
import Header from './components/Header';
import MoviesSection from './components/MoviesSection';
import SongsSection from './components/SongsSection';
import './App.css';

const App = () => {
  const [titleClick, setTitleClick] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSongSearch, setIsSongSearch] = useState(false);

  const handleTitleClick = (value) => {
    setSearchQuery('');
    setTitleClick(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleToggleChange = () => {
    setIsSongSearch(!isSongSearch);
    setSearchQuery('');
  };

  const handleEnterClick = (event) => {
    // Handle enter button click here
    setSearchQuery(event.target.value);
  };

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onTitleClick={() => handleTitleClick(true)}
        onToggleChange={handleToggleChange}
        isSongSearch={isSongSearch}
        onEnterClick={handleEnterClick}
      />
      {isSongSearch ? (
        <SongsSection searchQuery={searchQuery} handleTitleClick={handleTitleClick} />
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
