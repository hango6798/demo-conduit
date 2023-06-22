import { initialState as initialArticles, setArticles, setCurrentArticle } from "store/articlesSlice"
import { initialState as inititalProfile, setProfile } from "store/profilesSlice"
import { store } from "store/store"


const resetData = () => {
    store.dispatch(setCurrentArticle(initialArticles.currentArticle))
    store.dispatch(setProfile(inititalProfile.profile))
    store.dispatch(setArticles(initialArticles.articles))
}

export default resetData