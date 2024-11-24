import React, { useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Search from '../components/Header/Search';

const Layout = ({ children }) => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleSearch = () => {
        setIsSearchVisible((prev) => !prev);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="app">
            <Header toggleSearch={toggleSearch} />
            {isSearchVisible && (
                <Search
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    toggleSearch={toggleSearch}
                />
            )}
            <div className="scrollable">{children}</div>
            <Footer />
        </div>
    );
};

export default Layout;
