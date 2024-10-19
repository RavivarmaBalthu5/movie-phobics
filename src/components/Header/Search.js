import React from 'react';

const Search = ({ searchQuery, onSearchChange }) => {
    return (
        <div>
            <input
                type="text"
                placeholder="Search Movie..."
                value={searchQuery}
                onChange={onSearchChange}
                className="search-input"
            />
        </div>
    );
};

export default Search;
