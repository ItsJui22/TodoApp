import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import taskReducer from "../features/tasks/taskSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// 🔹 Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
});

// 🔹 Persist config
const persistConfig = {
  key: "root",
  storage,
};

// 🔹 Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Configure store with middleware fix
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);
