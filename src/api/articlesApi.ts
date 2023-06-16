import { Article, NewArticle } from "@models"
import { ParamsArticle } from "@models"
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
    unfavorite(slug:string):Promise<any> {
        const url = `articles/${slug}/favorite`
        return axiosClient.delete(url)
    },
    getCurrentArticle(slug:string):Promise<any> {
        const url = `articles/${slug}`
        return axiosClient.get(url)
    },
    createArticle(newArticle: NewArticle):Promise<any> {
        const url = `articles`
        return axiosClient.post(url, {
            "article": newArticle,
        })
    },
    updateArticle(slug:string, data: Article):Promise<any> {
        const url = `articles/${slug}`
        return axiosClient.put(url, {
            "article": data,
        })
    },
    deleteArticle(slug:string):Promise<any> {
        const url = `articles/${slug}`
        return axiosClient.delete(url)    
    }
}

export default articlesApi