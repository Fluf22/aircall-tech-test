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

export interface Note {
    id: string;
    content: string;
}

export interface Call {
    id: string; // "unique ID of call"
    direction: string; // "inbound" or "outbound" call
    from: string; // Caller's number
    to: string; // Callee's number
    duration: number; // Duration of a call (in seconds)
    is_archived: boolean; // Boolean that indicates if the call is archived or not
    call_type: string; // The type of the call, it can be a missed, answered or voicemail.
    via: string; // Aircall number used for the call.
    created_at: string; // When the call has been made.
    notes: Note[]; // Notes related to a given call
}

export interface GetCallsResponse {
    nodes: Call[];
    totalCount: number;
    hasNextPage: boolean;
}