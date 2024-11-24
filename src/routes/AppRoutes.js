import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MoviesSection from '../components/Movies/MoviesSection';

const AppRoutes = () => {
    const [titleClick, setTitleClick] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleTitleClick = (titleState) => {
        setSearchQuery('');
        setTitleClick(titleState);
    };

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <MoviesSection
                        titleClick={titleClick}
                        handleTitleClick={handleTitleClick}
                        searchQuery={searchQuery}
                    />
                }
            />
        </Routes>
    );
};

export default AppRoutes;
