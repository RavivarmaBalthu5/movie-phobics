import React from 'react';
import '../css/Header.css';
import MovieIcon from '../assets/movie-phobics.svg';

const Header = ({ searchQuery, onSearchChange, onTitleClick }) => {
    return (
        <header className="header">
            <div className="header-content">
                <img src={MovieIcon} alt="Movie Phobics Icon" className="header-icon" />
                <h1 className="header-title" onClick={onTitleClick}>MOVIE PHOBICS</h1>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={onSearchChange}
                    className="search-input"
                />
            </div>
        </header>
    );
};

export default Header;
