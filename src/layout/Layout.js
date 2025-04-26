import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Search from '../components/Header/Search';
import MoviesSection from '../components/Movies/MoviesSection';
import { useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    const now = Date.now();
                    const THIRTY_MINUTES = 30 * 60 * 1000;

                    if (now - userData.loginTime >= THIRTY_MINUTES) {
                        localStorage.removeItem('user');
                        navigate('/');
                    }
                } catch {
                    localStorage.removeItem('user');
                    navigate('/');
                }
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [navigate]);
    const toggleSearch = () => {
        setIsSearchVisible((prev) => !prev);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const renderMoviesSection = location.pathname === '/movies' ? (
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
