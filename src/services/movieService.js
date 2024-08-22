// src/service.js

const NETLIFY_API_URL = 'https://movie-phobics-apis.netlify.app/.netlify/functions/fetchMovieData';

export const fetchMovies = async (query) => {
    try {
        const response = await fetch(`${NETLIFY_API_URL}?movie=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return { results: [] }; // Return an empty results array in case of error
    }
};

export const fetchAllMovies = async (query) => {
    try {
        const response = await fetch(`${NETLIFY_API_URL}?allmovies=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return { results: [] }; // Return an empty results array in case of error
    }
};
