import { ParamsArticle } from './../models/article';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../models';
import articlesApi from '../api/articlesApi';

export interface ArticleState {
    globalArticles: Article[];
    feedArticles: Article[];
    globalStatus: 'idle' | 'loading' | 'failed';
    feedStatus: 'idle' | 'loading' | 'failed';
    globalArticlesCount: number;
    feedArticlesCount: number;
    currentFavSlug: string | null;
}

const initialState:ArticleState = {
    globalArticles: [],
    feedArticles: [],
    globalStatus: 'idle',
    feedStatus: 'idle',
    globalArticlesCount: 0,
    feedArticlesCount: 0,
    currentFavSlug: null,
};

export const fetchGlobalArticles = createAsyncThunk(
    'articles/fetchGlobalArticles',
    async (param:ParamsArticle,{dispatch, getState, rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await articlesApi.getGlobalArticles(param)
            const data = await response.data
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)
export const fetchFeedArticles = createAsyncThunk(
    'articles/fetchFeedArticles',
    async (param:ParamsArticle,{dispatch, getState, rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await articlesApi.getFeedArticles(param)
            const data = await response.data
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)

export const favorite = createAsyncThunk(
    'articles/favorite',
    async (slug:string, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await articlesApi.favorite(slug)
            const data = await response.data.article
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)

export const unFavorite = createAsyncThunk(
    'articles/unFavorite',
    async (slug:string, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await articlesApi.unFavorite(slug)
            const data = await response.data.article
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)



export const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        setCurrentFavSlug: (state: ArticleState, action: PayloadAction<string|null>) => {
            state.currentFavSlug = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGlobalArticles.pending, (state:ArticleState) => {
            state.globalStatus = "loading"
        })
        builder.addCase(fetchGlobalArticles.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            state.globalStatus = "idle"
            state.globalArticles = action.payload.articles
            state.globalArticlesCount = action.payload.articlesCount
        })
        builder.addCase(fetchGlobalArticles.rejected, (state:ArticleState, action: PayloadAction<any>) => {
            state.globalStatus = "failed"
        })
        builder.addCase(fetchFeedArticles.pending, (state:ArticleState) => {
            state.feedStatus = "loading"
        })
        builder.addCase(fetchFeedArticles.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            state.feedStatus = "idle"
            state.feedArticles = action.payload.articles
            state.feedArticlesCount = action.payload.articlesCount
        })
        builder.addCase(fetchFeedArticles.rejected, (state:ArticleState, action: PayloadAction<any>) => {
            state.feedStatus = "failed"
        })
        builder.addCase(favorite.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            const globalId:number = state.globalArticles.findIndex((a:Article) => a.slug === action.payload.slug)
            const feedId:number = state.feedArticles.findIndex((a:Article) => a.slug === action.payload.slug)

            globalId !== -1 && (state.globalArticles[globalId] = action.payload)
            feedId !== -1 && (state.feedArticles[feedId] = action.payload)
        })
        builder.addCase(unFavorite.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            const globalId:number = state.globalArticles.findIndex((a:Article) => a.slug === action.payload.slug)
            const feedId:number = state.feedArticles.findIndex((a:Article) => a.slug === action.payload.slug)

            globalId !== -1 && (state.globalArticles[globalId] = action.payload)
            feedId !== -1 && (state.feedArticles[feedId] = action.payload)
        })
    }
});

export const {setCurrentFavSlug} = articlesSlice.actions

export default articlesSlice.reducer
