import { API_BASE_URL, checkStatus, parseJSON } from "../helpers";

export const authSignin = (username: string, password: string) => {
    const headers = { "content-type": "application/json" };
    const body: string = JSON.stringify({ username, password });
    return fetch(`${API_BASE_URL}/auth/login`, { method: "POST", headers, body }).then(checkStatus).then(parseJSON);
};

export const authRefresh = (token: string) => {
    const headers = { "Authorization": `Bearer ${token}` };
    return fetch(`${API_BASE_URL}/auth/refresh-token-v2`, { method: "POST", headers }).then(checkStatus).then(parseJSON);
};