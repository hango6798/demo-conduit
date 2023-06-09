
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Login, NewUser, User } from '../../models';
import { RootState, store } from '../../store/store';

export interface UserState {
  user: User;
  status: 'idle' | 'loading' | 'failed';
  registerFailedMsg: any;
  auth: string | null;
}

const initialState:UserState = {
  user: {
    bio: '',
    username: '',
    email: '',
    image: '',
    token: undefined,
  },
  status: 'idle',
  registerFailedMsg: null,
  auth: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUser: (state: UserState, action?: PayloadAction<void>) => {
      state.status = 'loading'
    },
    fetchUserSuccess: (state: UserState, action: PayloadAction<User>) => {
        state.status = 'idle'
        state.user = action.payload
    },
    fetchUserFailed: (state: UserState, action: PayloadAction<any>) => {
        state.status = 'failed'
    },
    login: (state: UserState, action: PayloadAction<Login>) => {
        state.status = 'loading'
    },
    loginSuccess: (state: UserState, action: PayloadAction<User>) => {
        state.status = 'idle'
        state.user = action.payload
    },
    loginFailed: (state: UserState, action: PayloadAction<any>) => {
        state.status = 'failed'
    },
    logout: (state:UserState) => {
        state.user = initialState.user
        state.status = 'idle'
        localStorage.removeItem('token')
    },
    createNewUser: (state: UserState, action: PayloadAction<NewUser>) => {
        state.status = 'loading'
    },
    createNewUserSuccess: (state: UserState, action: PayloadAction<User>) => {
        state.status = 'idle'
        state.user = action.payload
        console.log(state.user)
    },
    createNewUserFailed: (state: UserState, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.registerFailedMsg = action.payload
    },
  },
});


export const { fetchUser, fetchUserSuccess, fetchUserFailed, login, loginSuccess, loginFailed, logout, createNewUser, createNewUserSuccess, createNewUserFailed } = userSlice.actions;


export default userSlice.reducer;
