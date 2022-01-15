import { Context, createContext, useContext } from "react";
import { AuthContextType } from "../interfaces";

export const AuthContext: Context<AuthContextType> = createContext<AuthContextType>(null!);

export const useAuth = () => {
    return useContext(AuthContext);
};