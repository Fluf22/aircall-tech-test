import { useEffect, useState } from "react";
import { authRefresh, authSignin } from "../../services";
import { AuthContext } from "../../hooks";
import { AuthResponse, User } from "../../interfaces";

interface AuthProviderProps {
    children: JSX.Element;
}

const AuthProvider = (props: AuthProviderProps) => {
    const [user, setUser] = useState<User>(null!);
    const [accessToken, setAccessToken] = useState<string>(null!);
    const [refreshToken, setRefreshToken] = useState<string>(null!);

    useEffect(() => {
        const authStr = localStorage.getItem("aircall-tech-test-auth");
        if (authStr) {
            try {
                const auth = JSON.parse(authStr);
                if (auth) {
                    setAccessToken(auth.access_token);
                    setRefreshToken(auth.refresh_token);
                    setUser(auth.user);
                }
            } catch (err) {
                console.error("Error during locale storage auth parsing: ", err);
                setAccessToken(null!);
                setRefreshToken(null!);
                setUser(null!);
            }
        }
    }, []);

    const signin = (username: string, password: string, callback?: VoidFunction) => {
        return authSignin(username, password).then((response: AuthResponse) => {
            localStorage.setItem("aircall-tech-test-auth", JSON.stringify(response));
            setAccessToken(response.access_token);
            setRefreshToken(response.refresh_token);
            setUser(response.user);
            callback?.();
        }).catch(err => {
            console.error("Error during signin: ", err);
        });
    };

    const signout = (callback: VoidFunction) => {
        return () => {
            localStorage.removeItem("aircall-tech-test-auth");
            setUser(null!);
            callback();
        };
    };

    const refresh = (token: string, callback?: VoidFunction) => {
        return authRefresh(token).then((response: AuthResponse) => {
            localStorage.setItem("aircall-tech-test-auth", JSON.stringify(response));
            setAccessToken(response.access_token);
            setRefreshToken(response.refresh_token);
            setUser(response.user);
            callback?.();
        }).catch(err => {
            console.error("Error during refresh: ", err);
        });
    };

    const value = { accessToken, refreshToken, user, signin, signout, refresh };

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;