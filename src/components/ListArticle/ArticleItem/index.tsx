import { ListGroup } from "react-bootstrap"
import { Article } from "../../../models"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './style.scss'
import { FavoriteButton } from "../../FavoriteButton";
import { Author } from "../../Author";

interface Props {
    article: Article;
    currentTab?: string;
    currentPage?: number;
    currentTag?: string;
}

export const ArticleItem = ({article, currentTab, currentPage, currentTag} : Props) => {
    const [favCount, setFavCount] = useState<number>(article.favoritesCount)
    const [favActive, setFavActive] = useState<boolean>(article.favorited)

    const articleUrl = `/article/${article.slug}`
    
    const author = article.author
    const createdTime = new Date(article.createdAt).toLocaleString('en-us',{ month:'long', day: 'numeric', year:'numeric'})

    useEffect(() => {
        setFavActive(article.favorited)
        setFavCount(article.favoritesCount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTab, currentPage, currentTag])

    const handleArticleClick = () => {
        window.scrollTo(0,0)
    }

    return <div className="p-3 article-item rounded">
        <div className="d-flex justify-content-between align-items-center">
            <Author author={author} createdTime={createdTime} variant="light"/>
            <FavoriteButton article={article} favActive={favActive} setFavActive={setFavActive} favCount={favCount} setFavCount={setFavCount}/>
        </div>
        <hr className="mt-3 mb-2"/>
        <Link to={articleUrl} className="title text-dark h5 mb-2 truncate-2" onClick={handleArticleClick}>
            {article.title}
        </Link>
        <div className="desc small text-secondary truncate-3">
            {article.description}
        </div>
        <div className="d-flex mt-2 align-items-center justify-content-between flex-wrap">
            <ListGroup className="d-flex flex-row flex-wrap tag-list" style={{margin: '0 -0.25rem'}}>
                {
                    article.tagList.map((tag:string, index:number) => {
                        return <ListGroup.Item key={index} className="border rounded small text-secondary p-0 px-2 pb-1 mx-1">
                            {tag}
                        </ListGroup.Item>
                    })
                }
            </ListGroup>
            <Link to={articleUrl} className="text-secondary fw-normal small readmore" onClick={handleArticleClick}>
                Read more...
            </Link>
        </div>
    </div>
}