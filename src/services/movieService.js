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

export const fetchMoviesWithPage = async (query) => {
    try {
        const response = await fetch(`${NETLIFY_API_URL}?now_playing_current_page=${encodeURIComponent(query)}`);
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

export const fetchTotalPages = async () => {
    try {
        const response = await fetch(`${NETLIFY_API_URL}?now_playing_total_pages=${true}`);
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
