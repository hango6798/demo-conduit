import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import tagsApi from '@api/tagsApi';

export interface TagsState {
    tags: string[];
    status: 'idle' | 'loading' | 'failed';
    currentTag: string;
}

const initialState:TagsState = {
    tags: [],
    status: 'idle',
    currentTag: '',
};

export const fetchTags = createAsyncThunk(
    'tags/fetchTags',
    // eslint-disable-next-line no-shadow-restricted-names
    async (undefined,{ rejectWithValue, fulfillWithValue}) => {
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
        setCurrentTag: (state: TagsState, action: PayloadAction<string>) => {
            state.currentTag = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTags.pending, (state:TagsState) => {
            state.status = "loading"
        })
        builder.addCase(fetchTags.fulfilled, (state:TagsState, action: PayloadAction<any>) => {
            state.status = "idle"
            state.tags = action.payload
        })
        builder.addCase(fetchTags.rejected, (state:TagsState, action: PayloadAction<any>) => {
            state.status = "failed"
        })
    }
});

export const { setCurrentTag } = tagsSlice.actions

export default tagsSlice.reducer
