const { DEFAULT_IMG_URL, IMG_BASE_URL, DEV_NETLIFY_API_URL, NETLIFY_API_URL } = require("./configs");

const fetchWithRetry = async (fetchFunction, query, retries = 3) => {
    let attempt = 0;
    while (attempt < retries) {
        try {
            return await fetchFunction(query);
        } catch (error) {
            attempt++;
            if (attempt >= retries) {
                throw error; // Re-throw if retries are exhausted
            }
            console.error(`Retrying fetch (${attempt}/${retries})...`, error);
            await new Promise(res => setTimeout(res, 1000)); // Wait before retrying
        }
    }
};
const getImageUrl = (movie) => {
    return movie?.poster_path ? `${IMG_BASE_URL}${movie?.poster_path}` : DEFAULT_IMG_URL;
}

const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return dateString;
    }

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const day = date.getDate();
    const monthYear = date.toLocaleDateString('en-US', options);

    const ordinalSuffix = (n) => {
        const suffixes = ["th", "st", "nd", "rd"];
        const value = n % 100;
        return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
    };

    return `${monthYear.split(' ')[0]} ${day}${ordinalSuffix(day)}, ${monthYear.split(' ')[2]}`;
};

const getYearFromDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return null;
    }

    return date.getFullYear();
};


const getNetlifyUrl = () => {
    if (window.location.href.includes("dev") || window.location.href.includes("localhost")) {
        return DEV_NETLIFY_API_URL
    }
    return NETLIFY_API_URL
}
const genreMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
};

module.exports = {
    fetchWithRetry,
    getImageUrl,
    formatReleaseDate,
    getYearFromDate,
    getNetlifyUrl,
    genreMap
}