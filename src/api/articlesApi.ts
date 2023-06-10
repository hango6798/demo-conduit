import { Articles } from "../models"
import { ParamsArticle } from "../models"
import axiosClient from "./axiosClient"

const articlesApi = {
    getGlobalArticles(params:ParamsArticle):Promise<any> {
        const url = 'articles'
        return axiosClient.get(url, {params})
    },
    getFeedArticles(params:ParamsArticle):Promise<any> {
        const url = 'articles/feed'
        return axiosClient.get(url, {params})
    },
    favorite(slug:string):Promise<any> {
        const url = `articles/${slug}/favorite`
        return axiosClient.post(url)
    },
    unFavorite(slug:string):Promise<any>{
        const url = `articles/${slug}/favorite`
        return axiosClient.delete(url)
    }
}

export default articlesApi