import { getAuthNetlifyUrl } from "../utils/utils";
export const auth = async (type, email, password, name = null) => {
    try {
        const body = {
            type,
            email,
            password,
        };

        if (name !== null) {
            body.name = name;
        }
        const response = await fetch(`${(getAuthNetlifyUrl())}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });
        return {
            status: response.status,
            data: await response.json()
        }
    } catch (error) {
        console.error('Error while authenticating:', error);
        return "";
    }
};


