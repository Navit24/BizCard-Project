import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TUser } from "../../types/TUser";

const initialState = {
  user: null as TUser | null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state: TUserSliceState, data: PayloadAction<TUser>) => {
      state.user = data.payload;
    },
    logout: (state: TUserSliceState) => {
      state.user = null;
    },
  },
});

export type TUserSliceState = typeof initialState;
export const userActions = userSlice.actions;
export default userSlice.reducer;
