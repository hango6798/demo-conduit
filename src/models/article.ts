import { PaginationParams } from "./common";
import { Author } from "./user";

export interface Article{
    id?:number;
    authorId?: number;
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
    favoritedBy?: Author[];
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