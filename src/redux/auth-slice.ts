import { ITechie } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
  user: ITechie | undefined;
};

const initialState: initialStateType = {
  user: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<ITechie>) {
      state.user = action.payload;
    },
  },
});

export default authSlice;
