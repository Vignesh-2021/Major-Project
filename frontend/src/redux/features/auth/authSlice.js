import { createSlice } from "@reduxjs/toolkit"

const loadUserFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem("user");
        return serializedState ? JSON.parse(serializedState) : null;
    } catch (error) {
        return null;
    }
};

const initialState = {
    user: loadUserFromLocalStorage(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => { 
            state.user = action.payload; // ✅ Directly setting user object
            localStorage.setItem("user", JSON.stringify(action.payload)); 
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
        }
    }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
