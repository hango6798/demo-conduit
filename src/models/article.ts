import { PaginationParams } from "./common";
import { Author } from "./user";

export interface Article{
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: Author
}

export interface Articles{
    articles: Article[],
    articlesCount: number
}

export interface ParamsArticle extends PaginationParams {
    tag?: string | null;
    author?: string;
    favorited?: string;
}

export type NewArticle = Pick<Article, 'title' | 'description' | 'body' | 'tagList'>