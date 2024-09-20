import React from 'react';
import '../css/Header.css';
import MovieIcon from '../assets/movie-phobics.svg';

const Header = ({ searchQuery, onSearchChange, onTitleClick }) => {
    let title = 'MOVIE PHOBICS';

    return (
        <header className="header">
            <div className="header-content">
                <img src={MovieIcon} alt="Movie Phobics Icon" className="header-icon" />
                <h1 className="header-title" onClick={onTitleClick}>{title}</h1>
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
