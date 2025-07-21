import { createSlice } from "@reduxjs/toolkit";

const loadAuthFromLocalStorage = () => {
    try {
        const serializedUser = localStorage.getItem("user");
        const serializedToken = localStorage.getItem("token");
        return {
            user: serializedUser ? JSON.parse(serializedUser) : null,
            token: serializedToken || null,
        };
    } catch (error) {
        console.error("Failed to load auth state from localStorage:", error);
        return { user: null, token: null };
    }
};

const initialState = {
    user: loadAuthFromLocalStorage().user,
    token: loadAuthFromLocalStorage().token,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token || "");
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;