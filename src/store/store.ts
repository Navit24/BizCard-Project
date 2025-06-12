import { combineReducers, configureStore } from "@reduxjs/toolkit";
import searchSlice from "./slices/searchSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
  reducer: { userSlice, searchSlice},
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({ serializableCheck: false }),
});
const RootReducer = combineReducers({ userSlice, searchSlice });
export type TRootState = ReturnType<typeof RootReducer>;
export default store;
