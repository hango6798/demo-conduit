import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { unfavorite, favorite, setCurrentFavSlug, setCurrentArticle } from "../../store/articlesSlice"
import { setShowPopup } from "../../store/userSlice"
import { Article } from "../../models"
import './style.scss'

interface Props {
    article: Article;
    variant?: string;
}

export const FavoriteButton = ({article, variant} : Props) => {
    const dispatch = useAppDispatch()
    const { token } = useAppSelector(store => store.userReducer)
    const { status, currentArticle } = useAppSelector(store => store.articlesReducer)
    const disabled = status.favorite === "loading" && currentArticle.slug === article.slug

    const handleFavorite = () => {
        if(token) {
            dispatch(setCurrentArticle(article))
            if(article.favorited){
                dispatch(unfavorite(article.slug))
            }
            else{
                dispatch(favorite(article.slug))
            }
        }
        else{
            dispatch(setShowPopup(true))
            dispatch(setCurrentFavSlug(article.slug))
        }
    }

    return <Button variant={`${variant ? variant : "outline-primary"}`} size="sm" active={!!token && article.favorited} onClick={handleFavorite} disabled={disabled}>
        <FontAwesomeIcon icon={faHeart} className="small me-2"/> 
        {article.favoritesCount}
    </Button>
}