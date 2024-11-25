import React, { createContext, useContext, useState, useEffect } from "react";

// Create Auth Context
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    // Verify session on app load
    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/auth/status", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(true);
                    setRole(data.role);
                    // console.log(data);
                    
                } else {
                    setIsAuthenticated(false);
                    setRole("");
                }
            } catch (error) {
                console.error("Session verification failed:", error);
                setIsAuthenticated(false);
                setRole("");
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, []);

    // Logout function
    const logout = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                setIsAuthenticated(false);
                setRole("");
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // Login function (Example)
    const login = async (username, password) => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(true);
                setRole(data.user.role); // Store role in context     
                console.log(data.user);
                           
                return data.user; // Return the user object
            } else {
                console.error("Login failed");
                return false;
            }
        } catch (error) {
            console.error("Error during login:", error);
            return false;
        }
    };
    

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                role,
                login,
                logout,
                loading,
            }}
        >
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
