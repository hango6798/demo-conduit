import { Articles, NewArticle, ParamsArticle } from 'models/article';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from 'models';
import articlesApi from 'api/articlesApi';

type Status = 'idle' | 'loading' | 'failed'

export interface ArticleState {
    articles: Articles | null;
    status: {
        articles: Status;
        currentArticle: Status;
    };
    currentFavSlug: string | null;
    currentArticle: Article;
}

export const initialState:ArticleState = {
    articles: null,
    status: {
        articles: 'idle',
        currentArticle: 'idle',
    },
    currentFavSlug: null,
    currentArticle: {
        slug: '',
        title: '',
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
    async (newArticle: NewArticle, { rejectWithValue, fulfillWithValue}) => {
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
    async (params: {slug:string, article: NewArticle}, { rejectWithValue, fulfillWithValue}) => {
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
        },
        setArticles: (state: ArticleState, action: PayloadAction<Articles | null>) => {
            state.articles = action.payload
        },
    },
    extraReducers: (builder) => {
        // Fetch Global Articles
        builder.addCase(fetchGlobalArticles.pending, (state:ArticleState) => {
            state.status.articles = "loading"
        })
        builder.addCase(fetchGlobalArticles.fulfilled, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.articles = "idle"
            state.articles = action.payload
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
            state.articles = action.payload
        })
        builder.addCase(fetchFeedArticles.rejected, (state:ArticleState, action: PayloadAction<any>) => {
            state.status.articles = "failed"
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

export const {setCurrentFavSlug, setCurrentArticle, setArticles} = articlesSlice.actions

export default articlesSlice.reducer
