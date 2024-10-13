import React, { useState } from 'react';
import Header from './components/Header';
import MoviesSection from './components/MoviesSection';
import Search from './components/Search';
import './App.css';
import './css/Common.css';

const App = () => {
  const [titleClick, setTitleClick] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleTitleClick = () => {
    setSearchQuery('');
    setTitleClick(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
  };

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onTitleClick={handleTitleClick}
        toggleSearch={toggleSearch}
        isSearchVisible={isSearchVisible} // Pass down the state
      />
      {isSearchVisible && (
        <Search
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      )}
      <div className='scrollable'>
        <MoviesSection
          titleClick={titleClick}
          handleTitleClick={handleTitleClick}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default App;
