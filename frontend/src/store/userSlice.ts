import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    id: string | null;
    fullName: string;
    email: string;
}

const initialState: UserState = {
    id: null,
    fullName: '',
    email: ''
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Partial<UserState>>) => {
           return { ...state, ...action.payload };
          },
        clearUser: (state) => {
            state.id = null;
            state.fullName = '';
            state.email = '';
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;