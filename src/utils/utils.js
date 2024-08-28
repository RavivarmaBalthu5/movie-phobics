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

module.exports = {
    fetchWithRetry
}