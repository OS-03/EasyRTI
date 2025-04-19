import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state interface
export interface AuthState {
    loading: boolean;
    user?: {
        _id:string;
        role: string;
        fullname: string;
        email: string;
        profile?: {
            profilePhoto?: string;
            bio?: string;
        };
        phoneNumber:string;
        updatedAt:Date;
    } | null;
}

// Define the initial state
const initialState: AuthState = {
    loading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setUser(state, action: PayloadAction<AuthState["user"]>) {
            state.user = action.payload;
        },
    },
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;