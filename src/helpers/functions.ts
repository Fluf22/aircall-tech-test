import { ResponseError, TokenRefreshInterval } from "../interfaces";

export const checkStatus = (response: Response) => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error: ResponseError = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.error(error);
    throw error;
};

export const parseJSON = (response: Response) => response.json();

export const isTokenExpired = (token: string, timeInterval: TokenRefreshInterval) => {
    try {
        const tokenPayload: string = token.split(".")[1];
        const decodedPayload: string = atob(tokenPayload);
        const { exp } = JSON.parse(decodedPayload);
        const now = (new Date()).getTime();
        const maxTimeBeforeRefresh = exp * 1000 - timeInterval;
        return now >= maxTimeBeforeRefresh;
    } catch (err) {
        console.error("Err during token issuance parsing: ", err);
        return false;
    }
};

export const isSameDay = (memberStr: string, otherStr: string) => {
    const member = new Date(memberStr);
    const other = new Date(otherStr);
    return member.getDate() === other.getDate()
        && member.getMonth() === other.getMonth()
        && member.getFullYear() === other.getFullYear();
};