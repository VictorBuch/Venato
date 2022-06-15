// /src/hooks/useAuth.tsx
import axios from "axios";
import React, { useState, createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/UserContext";

// Create the context
const AuthContext = createContext(null);

// TODO: make it update the user context when the user logs in or out

export const AuthProvider = ({ children }) => {
    const { user, setUser } = useContext(UserContext);

    function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    useEffect(() => {
        if (authed) {
            axios
                .get("/api/user")
                .then((res) => {
                    setUser({ ...res.data, cookie: getCookie("XSRF-TOKEN") });
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                });
        }
    }, []);

    // Using the useState hook to keep track of the value authed (if a
    // user is logged in)
    const [authed, setAuthed] = useState<boolean>(
        Boolean(getCookie("XSRF-TOKEN"))
    );

    const login = async (email: string, password: string): Promise<void> => {
        const result = await asyncLogin(email, password);

        if (result) {
            setAuthed(true);
        }
    };

    const logout = async (): Promise<void> => {
        const result = await asyncLogout();

        if (result) {
            setAuthed(false);
        }
    };

    const asyncLogin = async (
        email: string,
        password: string
    ): Promise<Boolean> => {
        const cookie = await axios.get("/sanctum/csrf-cookie");

        if (cookie.status === 204) {
            setUser({ ...user, cookie: getCookie("XSRF-TOKEN") });
            const response = await axios.post("/api/auth/login", {
                email,
                password,
            });

            if (response.status === 200) {
                setUser({ ...user, ...response.data });
                return true;
            } else {
                toast.error("Invalid credentials");
                return false;
            }
        } else {
            toast.error("Something went wrong");
            return false;
        }
    };

    const asyncLogout = async (): Promise<Boolean> => {
        const response = await axios.post("/api/auth/logout");
        if (response.status === 200) {
            sessionStorage.clear();
            return true;
        } else {
            toast.error("Something went wrong");
            return false;
        }
    };

    return (
        // Using the provider so that ANY component in our application can
        // use the values that we are sending.
        <AuthContext.Provider value={{ authed, setAuthed, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Finally creating the custom hook
export const useAuth = () => useContext(AuthContext);
