import { GITHUB_URL } from "../utils/configs";
import { getNetlifyUrl } from "../utils/utils";
const NodeCache = require("node-cache");
const myCache = new NodeCache();

export const fetchMovies = async (query) => {
    const cacheKey = `movies:${query}`;
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        console.log('Returning cached result for movies:', query);
        return cachedData;
    }

    try {
        const response = await fetch(`${getNetlifyUrl()}?movie=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        myCache.set(cacheKey, data, 300);
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return { results: [] };
    }
};

export const fetchMoviesWithPage = async (query) => {
    const cacheKey = `moviesWithPage:${query}`;
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        console.log('Returning cached result for movies with page:', query);
        return cachedData;
    }

    try {
        const response = await fetch(`${getNetlifyUrl()}?now_playing_current_page=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        myCache.set(cacheKey, data, 300);
        return data;
    } catch (error) {
        console.error('Error fetching all movies:', error);
        return { results: [] };
    }
};

export const fetchTotalPages = async () => {
    const cacheKey = 'totalPages';
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        console.log('Returning cached total pages');
        return cachedData;
    }

    try {
        const response = await fetch(`${getNetlifyUrl()}?now_playing_total_pages=${true}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        myCache.set(cacheKey, data, 300);
        return data;
    } catch (error) {
        console.error('Error fetching total pages:', error);
        return { results: [] };
    }
};

export const fetchVideos = async (query) => {
    const cacheKey = `videos:${query}`;
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        console.log('Returning cached result for videos:', query);
        return cachedData;
    }

    try {
        const response = await fetch(`${getNetlifyUrl()}?trailer=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        myCache.set(cacheKey, data, 300);
        return data;
    } catch (error) {
        console.error('Error fetching videos:', error);
        return { results: [] };
    }
};

export const fetchGitVersion = async () => {
    const cacheKey = 'gitVersion';
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        console.log('Returning cached git version');
        return cachedData;
    }

    try {
        const response = await fetch(GITHUB_URL);
        const data = await response.json();
        if (response.ok && data.tag_name) {
            myCache.set(cacheKey, data.tag_name, 300);
            return data.tag_name;
        } else {
            console.error('Failed to fetch release information');
            return "v1.0.0";
        }
    } catch (error) {
        console.error('Error fetching git version:', error);
        return "v1.0.0";
    }
};
