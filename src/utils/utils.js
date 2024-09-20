const { DEFAULT_IMG_URL, IMG_BASE_URL } = require("./configs");

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

module.exports = {
    fetchWithRetry,
    getImageUrl
}