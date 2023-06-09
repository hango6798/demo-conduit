import { Articles } from "../models"
import { ParamsArticle } from "../models"
import axiosClient from "./axiosClient"

const articlesApi = {
    getGlobalArticles(params:ParamsArticle):Promise<Articles> {
        const url = 'articles'
        return axiosClient.get(url, {params})
    },
    getFeedArticles(params:ParamsArticle):Promise<Articles> {
        const url = 'articles/feed'
        return axiosClient.get(url, {params})
    },
}

export default articlesApi