import React, { useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Search from '../components/Header/Search';
import MoviesSection from '../components/Movies/MoviesSection';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const toggleSearch = () => {
        setIsSearchVisible((prev) => !prev);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const renderMoviesSection = location.pathname === '/' ? (
        <MoviesSection searchQuery={searchQuery} toggleSearch={toggleSearch} isSearchVisible={isSearchVisible} />
    ) : null;

    return (
        <div className="app">
            <Header toggleSearch={toggleSearch} setSearchQuery={setSearchQuery} />
            {isSearchVisible && (
                <Search
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    toggleSearch={toggleSearch}
                />
            )}
            <div className="scrollable">{renderMoviesSection || children}</div>
            <Footer />
        </div>
    );
};

export default Layout;
