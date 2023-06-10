import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import tagsApi from '../api/tagsApi';

export interface tagsState {
    tags: string[];
    status: 'idle' | 'loading' | 'failed';
}

const initialState:tagsState = {
    tags: [],
    status: 'idle',
};

export const fetchTags = createAsyncThunk(
    'tags/fetchTags',
    // eslint-disable-next-line no-shadow-restricted-names
    async (undefined,{dispatch, getState, rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await tagsApi.getAll()
            const data = await response.data.tags
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)

export const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTags.pending, (state:tagsState) => {
            state.status = "loading"
        })
        builder.addCase(fetchTags.fulfilled, (state:tagsState, action: PayloadAction<any>) => {
            state.status = "idle"
            state.tags = action.payload
        })
        builder.addCase(fetchTags.rejected, (state:tagsState, action: PayloadAction<any>) => {
            state.status = "failed"
        })
    }
});


export default tagsSlice.reducer
