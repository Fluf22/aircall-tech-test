import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isTokenExpired } from "../../helpers";
import { useAuth } from "../../hooks";
import { AuthenticationState, TokenRefreshInterval } from "../../interfaces";
import LoadingOverlay from "../loading-overlay";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = (props: ProtectedRouteProps) => {
    const [authenticationState, setAuthenticationState] = useState<AuthenticationState>(AuthenticationState.LOADING);
    const auth = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (auth == null) {
            setAuthenticationState(AuthenticationState.LOADING);
        } else if (auth.accessToken == null || auth.refreshToken == null || isTokenExpired(auth.refreshToken, TokenRefreshInterval.REFRESH)) {
            setAuthenticationState(AuthenticationState.NOT_AUTH);
        } else if (auth.accessToken != null && isTokenExpired(auth.accessToken, TokenRefreshInterval.ACCESS)) {
            auth.refresh(auth.refreshToken).then(() => {
                setAuthenticationState(AuthenticationState.AUTH);
            }).catch(() => {
                setAuthenticationState(AuthenticationState.NOT_AUTH);
            });
        } else {
            setAuthenticationState(AuthenticationState.AUTH);
        }
    }, [auth]);

    if (authenticationState === AuthenticationState.LOADING) {
        return (
            <LoadingOverlay />
        );
    } else if (authenticationState === AuthenticationState.NOT_AUTH) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
        return props.children;
    }
};

export default ProtectedRoute;