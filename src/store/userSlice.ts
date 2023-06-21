import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Login, NewUser, User } from 'models';
import userApi from 'api/userApi';
import storage from 'redux-persist/es/storage';
import persistReducer from 'redux-persist/es/persistReducer';

type Status = 'idle' | 'loading' | 'failed'
export enum Popup {
    LOGIN = 'login',
    REGISTER = 'register',
}
type Error = {
    login: string | null,
    register: string | null,
    getUser: string | null,
    updateUser: string | null,
}

export interface UserState {
  user: User | null;
  status: {
    login: Status,
    register: Status,
    getUser: Status,
    updateUser: Status,
  }
  error: Error;
  showPopup: {
    name: Popup,
    open: boolean,
  };
}

const initialState:UserState = {
  user: null,
  status: {
    login: 'idle',
    register: 'idle',
    getUser: 'idle',
    updateUser: 'idle',
  },
  error: {
    login: null,
    register: null,
    getUser: null,
    updateUser: null,
  },
  showPopup: {
    name: Popup.LOGIN,
    open: false,
  },
};

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    // eslint-disable-next-line no-shadow-restricted-names
    async (undefined,{getState, rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await userApi.getCurrentUser()
            const data = await response.data.user
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)

export const login = createAsyncThunk(
    'user/login',
    async (loginInfo: Login, { rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await userApi.login(loginInfo)
            const data = await response.data.user
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)

export const register = createAsyncThunk(
    'user/register',
    async (newUserInfo: NewUser, { rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await userApi.register(newUserInfo)
            const data = await response.data.user
            return fulfillWithValue(data)
        } catch (error:any) {   
            throw rejectWithValue(error.response.data.errors)
        }
    }
)

export const updateUser = createAsyncThunk(
    'user/updateUser',
    // eslint-disable-next-line no-shadow-restricted-names
    async (newInfo:User,{ rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await userApi.updateUser(newInfo)
            const data = await response.data.user
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data)
        }
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state: UserState) => {
            state.user = initialState.user
            state.error = initialState.error
            state.status = initialState.status
        },
        setShowPopup: (state: UserState, action:PayloadAction<{name: Popup,open: boolean,}>) => {
            state.showPopup = action.payload
        },
        setError: (state: UserState, action:PayloadAction<Error>) => {
            state.error = action.payload
        },
    },
    extraReducers: (builder) => {
        // Fetch User
        builder.addCase(fetchUser.pending, (state) => {
            state.status.getUser = "loading"
        })
        builder.addCase(fetchUser.fulfilled, (state:UserState, action: PayloadAction<any>) => {
            state.status.getUser = "idle"
            state.user = action.payload
        })
        builder.addCase(fetchUser.rejected, (state:UserState, action: PayloadAction<any>) => {
            state.status.getUser = "failed"
            const listError = []
            for(let key of Object.keys(action.payload)){
                const message = key[0].toUpperCase() + key.slice(1) + ' ' + action.payload[key]
                listError.push(message)
            }
            state.error.getUser = listError[listError.length - 1]
        })
        // Login
        builder.addCase(login.pending, (state) => {
            state.status.login = "loading"
        })
        builder.addCase(login.fulfilled, (state:UserState, action: PayloadAction<any>) => {
            state.status.login = "idle"
            state.user = action.payload
        })
        builder.addCase(login.rejected, (state:UserState, action: PayloadAction<any>) => {
            state.status.login = "failed"
            const listError = []
            if(action.payload) {
                for(let key of Object.keys(action.payload)){
                    const message = key[0].toUpperCase() + key.slice(1) + ' ' + action.payload[key]
                    listError.push(message)
                }
                state.error.login = listError[listError.length - 1]
            }
        })
        // Register
        builder.addCase(register.pending, (state) => {
            state.status.register = "loading"
        })
        builder.addCase(register.fulfilled, (state:UserState, action: PayloadAction<any>) => {
            state.status.register = "idle"
            state.user = action.payload
        })
        builder.addCase(register.rejected, (state:UserState, action: PayloadAction<any>) => {
            state.status.register = "failed"
            const listError = []
            for(let key of Object.keys(action.payload)){
                const message = key[0].toUpperCase() + key.slice(1) + ' ' + action.payload[key]
                listError.push(message)
            }
            state.error.register = listError[listError.length - 1]
        })
        // Update User
        builder.addCase(updateUser.pending, (state) => {
            state.status.updateUser = "loading"
        })
        builder.addCase(updateUser.fulfilled, (state:UserState, action: PayloadAction<any>) => {
            state.status.updateUser = "idle"
            state.user = action.payload
        })
        builder.addCase(updateUser.rejected, (state:UserState, action: PayloadAction<any>) => {
            state.status.updateUser = "failed"
            state.error.updateUser = action.payload
        })
    }
});

export const { logout, setShowPopup, setError } = userSlice.actions;

const persistConfig = {
    key: 'user',
    storage: storage,
    whitelist: ['user'],
};

export default persistReducer(persistConfig, userSlice.reducer);
