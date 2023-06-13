import { ParamsArticle } from './../models/article';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../models';
import articlesApi from '../api/articlesApi';

type Status = 'idle' | 'loading' | 'failed'

export interface ArticleState {
    articles: Article[];
    status: {
        articles: Status;
        currentArticle: Status;
    };
    articlesCount: number;
    currentFavSlug: string | null;
    currentArticle: Article;
}

const initialState:ArticleState = {
    articles: [],
    status: {
        articles: 'idle',
        currentArticle: 'idle',
    },
    articlesCount: 0,
    currentFavSlug: null,
    currentArticle: {
        title: '',
        slug: '',
        description: '',
        body: '',
        tagList: [],
        createdAt: '',
        updatedAt: '',
        favorited: false,
        favoritesCount: 0,
        author: {
            following: false,
            username: '',
            bio: '',
            image: '',
        }
    },
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

export const getCurrentArticle = createAsyncThunk(
    'articles/getCurrentArticle',
    async (slug:string, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await articlesApi.getCurrentArticle(slug)
            const data = await response.data.article
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)

export const createArticle = createAsyncThunk(
    'articles/createArticle',
    async (newArticle: Article, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await articlesApi.createArticle(newArticle)
            const data = await response.data.article
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)


export const updateArticle = createAsyncThunk(
    'articles/updateArticle',
    async (params: {slug:string, article: Article}, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await articlesApi.updateArticle(params.slug, params.article)
            const data = await response.data.article
            return fulfillWithValue(data)
        } catch (error:any) {
            throw rejectWithValue(error.response.data.errors)
        }
    }
)

export const deleteArticle = createAsyncThunk(
    'articles/deleteArticle',
    async (slug:string, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await articlesApi.deleteArticle(slug)
            const data = await response.data
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
        // Fetch Global Articles
        builder.addCase(fetchGlobalArticles.pending, (state:ArticleState) => {
            state.status.articles = "loading"
        })
        builder.addCase(fetchGlobalArticles.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.articles = "idle"
            state.articles = action.payload.articles
            state.articlesCount = action.payload.articlesCount
        })
        builder.addCase(fetchGlobalArticles.rejected, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.articles = "failed"
        })
        // Fetch Feed Articles
        builder.addCase(fetchFeedArticles.pending, (state:ArticleState) => {
            state.status.articles = "loading"
        })
        builder.addCase(fetchFeedArticles.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.articles = "idle"
            state.articles = action.payload.articles
            state.articlesCount = action.payload.articlesCount
        })
        builder.addCase(fetchFeedArticles.rejected, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.articles = "failed"
        })
        // Favorite & Unfavorite
        builder.addCase(favorite.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            const id:number = state.articles.findIndex((a:Article) => a.slug === action.payload.slug)
            id !== -1 && (state.articles[id] = action.payload)
        })
        builder.addCase(unFavorite.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            const id:number = state.articles.findIndex((a:Article) => a.slug === action.payload.slug)
            id !== -1 && (state.articles[id] = action.payload)
        })
        // Get Current Article
        builder.addCase(getCurrentArticle.pending, (state:ArticleState) => {
            state.status.currentArticle = "loading"
        })
        builder.addCase(getCurrentArticle.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.currentArticle = "idle"
            state.currentArticle = action.payload
        })
        builder.addCase(getCurrentArticle.rejected, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.currentArticle = "failed"
        })
        // Create Article
        builder.addCase(createArticle.pending, (state:ArticleState) => {
            state.status.currentArticle = "loading"
        })
        builder.addCase(createArticle.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.currentArticle = "idle"
            state.currentArticle = action.payload
        })
        builder.addCase(createArticle.rejected, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.currentArticle = "failed"
        })
        // Update Article
        builder.addCase(updateArticle.pending, (state:ArticleState) => {
            state.status.currentArticle = "loading"
        })
        builder.addCase(updateArticle.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.currentArticle = "idle"
            state.currentArticle = action.payload
        })
        builder.addCase(updateArticle.rejected, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.currentArticle = "failed"
        })
        // Delete Article
        builder.addCase(deleteArticle.pending, (state:ArticleState) => {
            state.status.currentArticle = "loading"
        })
        builder.addCase(deleteArticle.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.currentArticle = "idle"
        })
        builder.addCase(deleteArticle.rejected, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.currentArticle = "failed"
        })
    }
});

export const {setCurrentFavSlug} = articlesSlice.actions

export default articlesSlice.reducer
