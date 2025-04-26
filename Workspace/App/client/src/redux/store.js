import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import chatReducer from "./chatSlide";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage'
  import { PersistGate } from 'redux-persist/integration/react'
  import storage_handelFull from './Handel_Full_LocalStorage' 
const persistConfig = {
    key: 'root',
    version: 1,
    storage: storage,
}

const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })

export let persistor = persistStore(store)

