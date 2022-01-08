export interface ResponseError extends Error {
    status?: string;
    response?: Response;
}

export interface AuthContextType {
    accessToken: string;
    refreshToken: string;
    user: User;
    signin: (username: string, password: string, callback?: VoidFunction) => Promise<void>;
    refresh: (token: string, callback?: VoidFunction) => Promise<void>;
    signout: (callback: VoidFunction) => void;
}

export interface User {
    id: string;
    username: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export enum TokenRefreshInterval {
    REFRESH = 0,
    ACCESS = 5 * 60 * 1000 // 5 minutes
}

export enum AuthenticationState {
    LOADING,
    NOT_AUTH,
    AUTH
}