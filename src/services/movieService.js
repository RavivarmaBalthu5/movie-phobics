// src/service.js

import { NETLIFY_API_URL } from "../utils/configs";

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
        console.error('Error fetching all movies:', error);
        return { results: [] }; // Return an empty results array in case of error
    }
};

export const fetchVideos = async (query) => {
    try {
        const response = await fetch(`${NETLIFY_API_URL}?trailer=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching videos:', error);
        return { results: [] }; // Return an empty results array in case of error
    }
};

export const fetchTracks = async (query) => {
    try {
        const response = await fetch(`${NETLIFY_API_URL}?username=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tracks:', error);
        return { results: [] }; // Return an empty results array in case of error
    }
};

export const addNewTrack = async (query, trackId) => {
    try {
        const response = await fetch(`${NETLIFY_API_URL}?username=${encodeURIComponent(query)}&updateTrackId=${encodeURIComponent(trackId)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error while adding tracks:', error);
        return { results: [] }; // Return an empty results array in case of error
    }
}