import { API_BASE_URL, checkStatus, parseJSON } from "../helpers";

export const fetchCalls = (token: string, offset: number = 0, limit: number = 10) => {
    const headers = { "Authorization": `Bearer ${token}` };
    return fetch(`${API_BASE_URL}/calls?offset=${offset}&limit=${limit}`, { headers })
        .then(checkStatus)
        .then(parseJSON)
        .catch(err => {
            console.error("Error while trying to fetch calls: ", err);
        });
};