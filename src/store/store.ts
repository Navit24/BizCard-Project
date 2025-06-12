import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import searchSlice from "./slices/searchSlice";

const store = configureStore({
  reducer: { userSlice, searchSlice},
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({ serializableCheck: false }),
});
const RootReducer = combineReducers({ userSlice, searchSlice });
export type TRootState = ReturnType<typeof RootReducer>;
export default store;
