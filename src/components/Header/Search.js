import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../css/Common.css';

const Search = ({ searchQuery, onSearchChange, toggleSearch }) => {
    const handleClear = () => {
        onSearchChange({ target: { value: '' } });
        toggleSearch()
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search Movie..."
                value={searchQuery}
                onChange={onSearchChange}
                className="search-input"
            />
            <FontAwesomeIcon
                icon={faTimes}
                size="lg"
                onClick={handleClear}
                className="clear-icon"
            />
        </div>
    );
};

export default Search;
