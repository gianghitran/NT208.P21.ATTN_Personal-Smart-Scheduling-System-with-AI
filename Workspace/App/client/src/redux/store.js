import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import chatReducer from "./chatSlide";
import recordReducer from "./recordSlide";

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
  import sesionstorage from 'redux-persist/lib/storage/session'
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


//Session storage lưu file record
const persistConfig2 = {
  key: 'root',
  version:1,
  storage: sesionstorage,
}

const rootReducer2 = combineReducers({
  record: recordReducer,
})
const persistedReducer2 = persistReducer(persistConfig2, rootReducer2)

export const sessionStore = configureStore({
  reducer: persistedReducer2,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'record/setRecord'],
        ignoredActionPaths: ['payload'], // ignore payload của action
        ignoredPaths: ['record.record']  // ignore path này trong state 
      },
    }),
  })

export let sessionPersistor = persistStore(sessionStore)

