import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Profile from 'models/profile';
import profilesApi from 'api/profilesApi';

type Status = 'idle' | 'loading' | 'failed'

export interface ProfileState {
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

export const initialState:ProfileState = {
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
export const profilesSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {
        setProfile: (state: ProfileState, action: PayloadAction<Profile>) => {
            state.profile = action.payload
        }
    },
    extraReducers: (builder) => {
        // Get Profile
        builder.addCase(getProfile.pending, (state) => {
            state.status.getProfile = "loading"
        })
        builder.addCase(getProfile.fulfilled, (state:ProfileState, action: PayloadAction<any>) => {
            state.status.getProfile = "idle"
            state.profile = action.payload
        })
        builder.addCase(getProfile.rejected, (state:ProfileState, action: PayloadAction<any>) => {
            state.status.getProfile = "failed"
            state.error.getProfile = action.payload
        })
    }
});

export const {setProfile} = profilesSlice.actions

export default profilesSlice.reducer;
