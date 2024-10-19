import React, { useState } from 'react';
import Header from './components/Header/Header';
import MoviesSection from './components/Movies/MoviesSection';
import Search from './components/Header/Search';
import './App.css';
import './css/Common.css';
import Footer from './components/Footer/Footer';

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
        onTitleClick={handleTitleClick}
        toggleSearch={toggleSearch}
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
      <Footer />
    </div>
  );
};

export default App;
