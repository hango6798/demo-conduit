

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import commentApi from '@api/commentApi';
import { Comment } from '@models';

type Status = 'idle' | 'loading' | 'failed'

export interface commentsState {
    comments: Comment[];
    status: {
        getComments: Status,
        createComment: Status,
        deleteComment: Status,
    }
}

const initialState:commentsState = {
    comments: [],
    status: {
        getComments: 'idle',
        createComment: 'idle',
        deleteComment: 'idle',
    },
};

export const getComments = createAsyncThunk(
    'comments/getComments',
    // eslint-disable-next-line no-shadow-restricted-names
    async (slug:string,{ rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await commentApi.getComments(slug)
            const data = await response.data.comments
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)
export const createComment = createAsyncThunk(
    'comments/createComment',
    // eslint-disable-next-line no-shadow-restricted-names
    async (params: {slug:string, comment:string},{ rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await commentApi.createComment(params.slug, params.comment)
            const data = await response.data.comment
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)
export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    // eslint-disable-next-line no-shadow-restricted-names
    async (params: {slug:string, commentId:number},{ rejectWithValue, fulfillWithValue}) => {
        try {
            commentApi.deleteComment(params.slug, params.commentId)
            return fulfillWithValue(params.commentId)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)


export const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // fetch article comments
        builder.addCase(getComments.pending, (state:commentsState) => {
            state.status.getComments = "loading"
        })
        builder.addCase(getComments.fulfilled, (state:commentsState, action: PayloadAction<any>) => {
            state.status.getComments = "idle"
            state.comments = action.payload
        })
        builder.addCase(getComments.rejected, (state:commentsState, action: PayloadAction<any>) => {
            state.status.getComments = "failed"
        })
        // create new comment
        builder.addCase(createComment.pending, (state:commentsState) => {
            state.status.createComment = "loading"
        })
        builder.addCase(createComment.fulfilled, (state:commentsState, action: PayloadAction<any>) => {
            state.status.createComment = "idle"
            state.comments = [
                ...state.comments,
                action.payload
            ]
        })
        builder.addCase(createComment.rejected, (state:commentsState, action: PayloadAction<any>) => {
            state.status.createComment = "failed"
        })
        // delete comment
        builder.addCase(deleteComment.pending, (state:commentsState) => {
            state.status.deleteComment = "loading"
        })
        builder.addCase(deleteComment.fulfilled, (state:commentsState, action: PayloadAction<any>) => {
            state.status.deleteComment = "idle"
            const id = state.comments.findIndex((comment:Comment) => comment.id === action.payload)
            state.comments.splice(id, 1)
        })
        builder.addCase(deleteComment.rejected, (state:commentsState, action: PayloadAction<any>) => {
            state.status.deleteComment = "failed"
        })
    }
});


export default commentSlice.reducer
