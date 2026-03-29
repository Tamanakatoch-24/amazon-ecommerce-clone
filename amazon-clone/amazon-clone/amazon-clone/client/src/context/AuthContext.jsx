import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext();

const USERS_STORAGE_KEY = "amazon_clone_users";
const SESSION_STORAGE_KEY = "amazon_clone_current_user";

function AuthProvider({ children }) {
    const [users, setUsers] = useState(() => {
        try {
            const raw = localStorage.getItem(USERS_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const raw = localStorage.getItem(SESSION_STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const signup = ({ name, email, password }) => {
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const normalizedName = String(name || "").trim();

        if (!normalizedName || !normalizedEmail || !password) {
            return { ok: false, message: "All fields are required" };
        }

        const exists = users.some((user) => user.email === normalizedEmail);
        if (exists) {
            return { ok: false, message: "Account already exists" };
        }

        const newUser = {
            id: "U" + Date.now() + Math.floor(Math.random() * 1000),
            name: normalizedName,
            email: normalizedEmail,
            password
        };

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

        const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
        setCurrentUser(sessionUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));

        return { ok: true, user: sessionUser };
    };

    const login = ({ email, password }) => {
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const found = users.find((user) => user.email === normalizedEmail && user.password === password);

        if (!found) {
            return { ok: false, message: "Invalid email or password" };
        }

        const sessionUser = { id: found.id, name: found.name, email: found.email };
        setCurrentUser(sessionUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));

        return { ok: true, user: sessionUser };
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem(SESSION_STORAGE_KEY);
    };

    const value = useMemo(() => ({
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        signup,
        logout
    }), [currentUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
