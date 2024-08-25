import React, { useState } from 'react';
import Header from './components/Header';
import MoviesSection from './components/MoviesSection';
import './App.css';

const App = () => {
  const [titleClick, setTitleClick] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTitleClick = (value) => {
    setTitleClick(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onTitleClick={() => handleTitleClick(true)}
      />
      <MoviesSection
        titleClick={titleClick}
        handleTitleClick={handleTitleClick}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default App;
