import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../css/Common.css';

const Search = ({ searchQuery, onSearchChange }) => {
    const handleClear = () => {
        onSearchChange({ target: { value: '' } });
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
            {searchQuery && (
                <FontAwesomeIcon
                    icon={faTimes}
                    size="lg"
                    onClick={handleClear}
                    className="clear-icon"
                />
            )}
        </div>
    );
};

export default Search;
