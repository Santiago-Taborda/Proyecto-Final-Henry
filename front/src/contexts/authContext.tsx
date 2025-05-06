"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { ServiceProfileType, UserType } from "@/helpers/typeMock";

interface AuthContextType {
    user: UserType | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string, user: UserType) => Promise<void>;
    logout: () => void;
    updateService: (service: ServiceProfileType) => void;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser && storedUser !== "undefined") {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Error al parsear el usuario desde localStorage:", err);
                localStorage.removeItem("user");
            }
        } else if (storedToken) {
            logout();
        }

        setLoading(false);
    }, []);

    const login = async (jwtToken: string, userData: UserType) => {
        try {
            localStorage.setItem("token", jwtToken);
            setToken(jwtToken);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userData.id}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            if (!res.ok) throw new Error("Error al obtener datos actualizados del usuario");

            const updatedUser = await res.json();

            if (updatedUser.phone === 0) {
                updatedUser.phone = undefined;
            }

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch {
            logout();
        }
    };


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    };

    const updateService = (serviceProfile: ServiceProfileType) => {
        if (user) setUser({ ...user, serviceProfile })
    }

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateService,
        setUser,
    };


    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
};
