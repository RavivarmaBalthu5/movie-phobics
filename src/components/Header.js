// src/Header.js
import React from 'react';
import '../css/Header.css'; // Import the CSS file specific to the header


const Header = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
    return (
        <header className="header">
            <h1 className="header-title">Movie Phobics</h1>
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

