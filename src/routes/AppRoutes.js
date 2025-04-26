import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MoviesSection from '../components/Movies/MoviesSection';
import MovieDetails from '../components/Movies/MovieDetails';
import NotFound from '../components/Common/NotFound';
import AuthPage from '../components/Auth/AuthPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/movies" element={<MoviesSection />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/" element={<AuthPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
