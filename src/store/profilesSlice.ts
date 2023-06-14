import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Profile from '../models/profile';
import profilesApi from '../api/profilesApi';

type Status = 'idle' | 'loading' | 'failed'

export interface UserState {
  profile: Profile;
  status: {
    getProfile: Status;
    follow: Status;
  };
  error: {
    getProfile: string | null;
    follow: string | null;
  };
}

const initialState:UserState = {
    profile: {
        username: '',
        bio: '',
        image: '',
        following: false
    },
    status: {
        getProfile: "idle",
        follow: "idle",
    },
    error: {
        getProfile: null,
        follow: null,
    },
};

export const getProfile = createAsyncThunk(
    'profiles/getProfile',
    // eslint-disable-next-line no-shadow-restricted-names
    async (username:string,{ rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await profilesApi.getProfile(username)
            const data = await response.data.profile
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)

export const follow = createAsyncThunk(
    'profiles/follow',
    async (username:string, { rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await profilesApi.follow(username)
            const data = await response.data.profile
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)

export const unfollow = createAsyncThunk(
    'profiles/unfollow',
    async (username:string, { rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await profilesApi.unfollow(username)
            const data = await response.data.profile
            return fulfillWithValue(data)
        } catch (error:any) {   
            throw rejectWithValue(error.response.data.errors)
        }
    }
)
export const profilesSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Get Profile
        builder.addCase(getProfile.pending, (state) => {
            state.status.getProfile = "loading"
        })
        builder.addCase(getProfile.fulfilled, (state:UserState, action: PayloadAction<any>) => {
            state.status.getProfile = "idle"
            state.profile = action.payload
        })
        builder.addCase(getProfile.rejected, (state:UserState, action: PayloadAction<any>) => {
            state.status.getProfile = "failed"
            const listError = []
            for(let key of Object.keys(action.payload)){
                const message = key[0].toUpperCase() + key.slice(1) + ' ' + action.payload[key]
                listError.push(message)
            }
            state.error.getProfile = listError[listError.length - 1]
        })
        // Follow
        builder.addCase(follow.pending, (state) => {
            state.status.follow = "loading"
            state.profile.following = true
        })
        builder.addCase(follow.fulfilled, (state:UserState, action: PayloadAction<any>) => {
            state.status.follow = "idle"
            state.profile.following = action.payload.following
        })
        builder.addCase(follow.rejected, (state:UserState, action: PayloadAction<any>) => {
            state.status.follow = "failed"
            const listError = []
            if(action.payload) {
                for(let key of Object.keys(action.payload)){
                    const message = key[0].toUpperCase() + key.slice(1) + ' ' + action.payload[key]
                    listError.push(message)
                }
                state.error.follow = listError[listError.length - 1]
            }
            state.profile.following = false
        })
        // Unfollow
        builder.addCase(unfollow.pending, (state) => {
            state.status.follow = "loading"
            state.profile.following = false
        })
        builder.addCase(unfollow.fulfilled, (state:UserState, action: PayloadAction<any>) => {
            state.status.follow = "idle"
            state.profile.following = action.payload.following
        })
        builder.addCase(unfollow.rejected, (state:UserState, action: PayloadAction<any>) => {
            state.status.follow = "failed"
            const listError = []
            for(let key of Object.keys(action.payload)){
                const message = key[0].toUpperCase() + key.slice(1) + ' ' + action.payload[key]
                listError.push(message)
            }
            state.error.follow = listError[listError.length - 1]
            state.profile.following = true
        })
    }
});


export default profilesSlice.reducer;
