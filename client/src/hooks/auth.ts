import { useContext, useState } from "react";
import { IAuthUser } from "../models/auth";
import AXIOS from 'axios'

import { AuthContext } from "../contexts/auth";
import { IAuthContext } from "../models/auth";

function useUser() {
    const {user} = useContext(AuthContext)
    return user
}

function useLogout() {
    const {logout} = useContext(AuthContext)
    return logout
}

function useLogin() {
    const {login} = useContext(AuthContext)
    return login
}

function useAuth(): IAuthContext {
    const storedUserString = localStorage.getItem('user');
    const storedUser: IAuthUser | null = storedUserString ? JSON.parse(storedUserString) : null;  
    const [user, setUser] = useState<IAuthUser | null>(storedUser);

    async function login(email: string, password: string): Promise<'SUCCESS' | 'FAILURE'> {
        try {
        const response = await AXIOS.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/auth`, {
            params: {
            email: email,
            password: password,
            },
        });

        if (response.status !== 200) {
            return 'FAILURE';
        }

        const userData = response.data as IAuthUser;
        if (userData == null) return 'FAILURE';
        setUser(userData);

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        return 'SUCCESS';
        } catch (error) {
        console.error('Error during login:', error);
        return 'FAILURE';
        }
    }

    function logout() {
        localStorage.removeItem('user');
        setUser(null);
    }

    const context: IAuthContext = {
        user: user,
        login: login,
        logout: logout,
    };

  return context;
}

export { useUser, useLogin, useLogout, useAuth}
