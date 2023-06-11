import { Image, Button, ListGroup } from "react-bootstrap"
import { Article } from "../../../models"
import { Link } from "react-router-dom";
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useEffect, useState } from "react";
import { setShowPopup } from "../../../store/userSlice";
import { favorite, setCurrentFavSlug, unFavorite } from "../../../store/ArticlesSlice";
import './style.scss'

interface Props {
    article: Article;
    currentTab?: string;
    currentPage?: number;
    currentTag?: string;
}

export const ArticleItem = ({article, currentTab, currentPage, currentTag} : Props) => {
    const dispatch = useAppDispatch()
    const {token} = useAppSelector(store => store.userReducer)

    const [favCount, setFavCount] = useState<number>(article.favoritesCount)
    const [favActive, setFavActive] = useState<boolean>(article.favorited)

    const articleUrl = `/article/${article.slug}`
    const authorUrl = `/profiles/@${article.author.username}`
    
    const author = article.author
    const createdTime = new Date(article.createdAt).toLocaleString('en-us',{ month:'long', day: 'numeric', year:'numeric'})

    const handleFavorite = () => {
        if(token) {
            article.favorited ? dispatch(unFavorite(article.slug)) : dispatch(favorite(article.slug))
            favActive ? setFavCount(favCount - 1) : setFavCount(favCount + 1)
            setFavActive(!favActive)
        }
        else{
            dispatch(setShowPopup(true))
            dispatch(setCurrentFavSlug(article.slug))
        }
    }
    useEffect(() => {
        setFavActive(article.favorited)
        setFavCount(article.favoritesCount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTab, currentPage, currentTag])

    const handleAuthorClick = () => {
        window.scrollTo(0,0)
    }

    return <div className="p-3 border rounded h-100">
        <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
                <Link to={authorUrl} className="me-2" onClick={handleAuthorClick}>
                    <Image src={author.image} alt="" rounded width={40} height={40}/>
                </Link>
                <div>
                    <Link to={authorUrl} className="text-dark fw-medium authorName" onClick={handleAuthorClick}>
                        {author.username}
                    </Link>
                    <p className="text-secondary small mb-0">{createdTime}</p>
                </div>
            </div>
            <Button variant="outline-primary" size="sm" active={!!token && favActive} onClick={handleFavorite}>
                <FontAwesomeIcon icon={faHeart} className="small me-2"/> 
                {favCount}
            </Button>
        </div>
        <hr className="mt-3 mb-2"/>
        <Link to={articleUrl} className="title text-dark h5 mb-2 truncate-2">
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
            <Link to={articleUrl} className="text-secondary fw-normal small readmore">
                Read more...
            </Link>
        </div>
    </div>
}