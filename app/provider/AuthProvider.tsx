"use client";

import { createContext, useActionState, useContext, useEffect, useState } from "react";
import { AuthContextType, Role, User } from "../types";
import { apiClient } from "../lib/apiClient";

type LoginState ={
    success?: boolean;
    user?: User | null;
    error?: string;
}

const authContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loginState,loginAction,isLoginPending] = useActionState(
        async(prevState:LoginState, formdata:FormData):Promise<LoginState> => {
            const email = formdata.get("email") as string;
            const password = formdata.get("password") as string;
            try {
                const data = await apiClient.login(email, password) as unknown as {user: User};
                setUser(data.user);
                return { success: true, user: data.user };
            } catch (error) {
                console.error("Login error:", error);
                return {
                 error: error instanceof Error ? error.message : "Login failed"};
            };
        }, 
        {error: undefined,user: undefined,success: undefined,} as LoginState
    );

    //load user on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await apiClient.getCurrentUser();
                setUser(userData || null);
            } catch (error) {
                console.error("Error loading user:", error);
            }
        };
        loadUser();
    }, []);

    const logout = async () => {
        try {
        await apiClient.logout();
        setUser(null);
        window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const hasPermission = (requiredRole: Role): boolean => {
        if (!user) return false;
        const roleHierarchy = {
            [Role.GUEST]: 0,
            [Role.USER]: 1,
            [Role.MANAGER]: 2,
            [Role.ADMIN]: 3,
          };
        return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
    }

    return (
        <authContext.Provider value={{
            user,
            login: loginAction,
            logout,
            hasPermission,
        }}>
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(authContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthProvider;