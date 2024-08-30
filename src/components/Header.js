import React from 'react';
import '../css/Header.css';
import MovieIcon from '../assets/movie-phobics.svg';

const Header = ({ searchQuery, onSearchChange, onTitleClick, onToggleChange, isSongSearch }) => {
    let title = 'MOVIE PHOBICS';
    if (isSongSearch) {
        title = 'SONG PHOBICS';
    }

    return (
        <header className="header">
            <div className="header-content">
                <img src={MovieIcon} alt="Movie Phobics Icon" className="header-icon" />
                <h1 className="header-title" onClick={onTitleClick}>{title}</h1>
            </div>
            <div className="header-right">
                <div className="search-container">
                    {
                        !isSongSearch && <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={onSearchChange}
                            className="search-input"
                        />
                    }
                    <div className="switch-container">
                        <label className="switch">
                            <input type="checkbox" checked={isSongSearch} onChange={onToggleChange} />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
