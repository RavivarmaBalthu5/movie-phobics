import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MoviesSection from '../components/Movies/MoviesSection';
import MovieDetails from '../components/Movies/MovieDetails';
import NotFound from '../components/Common/NotFound';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MoviesSection />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
