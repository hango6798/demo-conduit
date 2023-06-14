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
        favorite: Status;
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
        favorite: 'idle'
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
    async (param:ParamsArticle,{ rejectWithValue, fulfillWithValue}) => {
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
    async (param:ParamsArticle,{ rejectWithValue, fulfillWithValue }) => {
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
    async (slug:string, { dispatch, getState, rejectWithValue, fulfillWithValue}) => {
        const { articlesReducer }:any = getState()
        const {articles, currentArticle} = articlesReducer
        const id = articles.findIndex((article: Article) => article.slug === slug)
        try {
            if(currentArticle.slug){
                dispatch(setCurrentArticle({
                    ...currentArticle,
                    favorited: true,
                    favoritesCount: currentArticle.favoritesCount + 1
                }))
            }
            const response = await articlesApi.favorite(slug)
            const data = await response.data.article
            return fulfillWithValue({data, id})
        } catch (error:any) {
            if(currentArticle.slug){
                dispatch(setCurrentArticle({
                    ...currentArticle,
                    favorited: false,
                    favoritesCount: currentArticle.favoritesCount - 1
                }))
            }
            const err = error.response.data.errors
            throw rejectWithValue({err, id})
        }
    },
)

export const unfavorite = createAsyncThunk(
    'articles/unfavorite',
    async (slug:string, { dispatch, getState, rejectWithValue, fulfillWithValue}) => {
        const { articlesReducer }:any = getState()
        const {articles, currentArticle} = articlesReducer
        const id = articles.findIndex((article: Article) => article.slug === slug)
        try {
            if(currentArticle.slug){
                dispatch(setCurrentArticle({
                    ...currentArticle,
                    favorited: false,
                    favoritesCount: currentArticle.favoritesCount - 1
                }))
            }
            const response = await articlesApi.unfavorite(slug)
            const data = await response.data.article
            return fulfillWithValue({data, id})
        } catch (error:any) {
            if(currentArticle.slug){
                dispatch(setCurrentArticle({
                    ...currentArticle,
                    favorited: true,
                    favoritesCount: currentArticle.favoritesCount + 1
                }))
            }
            const err = error.response.data.errors
            throw rejectWithValue({err, id})
        }
    }
)

export const getCurrentArticle = createAsyncThunk(
    'articles/getCurrentArticle',
    async (slug:string, { rejectWithValue, fulfillWithValue}) => {
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
    async (newArticle: Article, { rejectWithValue, fulfillWithValue}) => {
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
    async (params: {slug:string, article: Article}, { rejectWithValue, fulfillWithValue}) => {
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
    async (slug:string, { rejectWithValue, fulfillWithValue}) => {
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
        },
        setCurrentArticle: (state: ArticleState, action: PayloadAction<Article>) => {
            state.currentArticle = action.payload
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
        // Favorite
        builder.addCase(favorite.pending, (state:ArticleState, {meta}) => {
            state.status.favorite = "loading"
            if(!!state.articles.length){
                const id = state.articles.findIndex((article: Article) => article.slug === meta.arg)
                state.articles[id].favorited = true
                state.articles[id].favoritesCount += 1
            }
        })
        builder.addCase(favorite.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.favorite = "idle"
            if(!!state.articles.length){
                const id = action.payload.id
                const article = action.payload.data
                if(id !== -1) {
                    state.articles[id].favorited = article.favorited
                    state.articles[id].favoritesCount = article.favoritesCount
                }
            }
        })
        builder.addCase(favorite.rejected, (state:ArticleState, action: PayloadAction<any>) => {
            if(!!state.articles.length){
                const id = action.payload.id
                state.status.favorite = "failed"
                state.articles[id].favorited = false
                state.articles[id].favoritesCount -= 1
            }
        })
        // Unfavorite
        builder.addCase(unfavorite.pending, (state:ArticleState, {meta}) => {
            state.status.favorite = "loading"
            if(!!state.articles.length){
                const id = state.articles.findIndex((article: Article) => article.slug === meta.arg)
                state.articles[id].favorited = false
                state.articles[id].favoritesCount -= 1
            }
        })
        builder.addCase(unfavorite.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.favorite = "idle"
            if(!!state.articles.length){
                const id = action.payload.id
                const article = action.payload.data
                if(id !== -1) {
                    state.articles[id].favorited = article.favorited
                    state.articles[id].favoritesCount = article.favoritesCount
                }
            }
        })
        builder.addCase(unfavorite.rejected, (state:ArticleState, action: PayloadAction<any>) => {
            if(!!state.articles.length){
                const id = action.payload.id
                state.status.favorite = "failed"
                state.articles[id].favorited = true
                state.articles[id].favoritesCount += 1
            }
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

export const {setCurrentFavSlug, setCurrentArticle} = articlesSlice.actions

export default articlesSlice.reducer
