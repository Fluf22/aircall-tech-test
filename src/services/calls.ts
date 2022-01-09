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

export const addNote = (token: string, callId: string, content: string) => {
    const headers = { "Authorization": `Bearer ${token}`, "content-type": "application/json" };
    const body = JSON.stringify({ content });
    return fetch(`${API_BASE_URL}/calls/${callId}/note`, { method: "POST", headers, body })
        .then(checkStatus)
        .then(parseJSON)
        .catch(err => {
            console.error(`Error while trying to add a note to a call (ID: ${callId}): `, err);
        });
};

export const triggerArchiveStatus = (token: string, callId: string) => {
    const headers = { "Authorization": `Bearer ${token}` };
    return fetch(`${API_BASE_URL}/calls/${callId}/archive`, { method: "PUT", headers })
        .then(checkStatus)
        .then(parseJSON)
        .catch(err => {
            console.error(`Error while trying to trigger archive status on a call (ID: ${callId}): `, err);
        });
};