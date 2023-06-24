import { configureStore, ThunkAction, Action, combineReducers} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import userReducer from './userSlice'
import articlesReducer from './articlesSlice'
import tagsReducer from './tagsSlice'
import profilesReducer from './profilesSlice'
import commentsReducer from './commentsSlice'
import { createStateSyncMiddleware, initStateWithPrevTab, withReduxStateSync } from 'redux-state-sync';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: []
}
const stateSyncConfig = {
  whitelist: ["user/login/fulfilled", "user/logout", "user/fetchUser/fulfilled", "user/updateUser/fulfilled"]
}
const stateSyncMiddleware = [createStateSyncMiddleware(stateSyncConfig)]
const persistedReducer = persistReducer(persistConfig, combineReducers({
    userReducer,
    articlesReducer,
    tagsReducer,
    profilesReducer,
    commentsReducer
}))

export const store = configureStore({
  reducer: withReduxStateSync(persistedReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
  }).concat(stateSyncMiddleware),
});

initStateWithPrevTab(store);
export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
