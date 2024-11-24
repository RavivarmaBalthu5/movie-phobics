import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MoviesSection from '../components/Movies/MoviesSection';
import MovieDetails from '../components/Movies/MovieDetails';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MoviesSection />} />
            <Route path="/movies/:id" element={<MovieDetails key={window.location.pathname} />} />
        </Routes>
    );
};

export default AppRoutes;
