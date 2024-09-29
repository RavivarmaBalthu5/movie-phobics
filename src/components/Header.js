import React from 'react';
import '../css/Header.css';
import MovieIcon from '../assets/movie-phobics.png';

const Header = ({ searchQuery, onSearchChange, onTitleClick }) => {
    return (
        <header className="header">
            <div className="header-content">
                <img className="header-title" onClick={onTitleClick} src={MovieIcon} alt="Movie Phobics Icon" />
            </div>
            <div className="header-right">
                <div className="search-container">
                    {
                        <input
                            type="text"
                            placeholder="Search Movie..."
                            value={searchQuery}
                            onChange={onSearchChange}
                            className="search-input"
                        />
                    }

                </div>
            </div>
        </header>
    );
};

export default Header;
