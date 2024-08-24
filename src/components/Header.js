// src/Header.js
import React from 'react';
import '../css/Header.css'; // Import the CSS file specific to the header
import MovieIcon from '../assets/movie-phobics.svg'; // Import the SVG icon

const Header = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
    return (
        <header className="header">
            <div className="header-content">
                <img src={MovieIcon} alt="Movie Phobics Icon" className="header-icon" />
                <h1 className="header-title">MOVIE PHOBICS</h1>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={onSearchChange}
                    className="search-input"
                />
                <button
                    onClick={onSearchSubmit}
                    className="search-button"
                >
                    Enter
                </button>
            </div>
        </header>
    );
};

export default Header;
