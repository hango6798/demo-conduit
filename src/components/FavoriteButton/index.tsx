import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { unFavorite, favorite, setCurrentFavSlug } from "../../store/ArticlesSlice"
import { setShowPopup } from "../../store/userSlice"
import { Article } from "../../models"

interface Props {
    article: Article;
    favActive: boolean;
    setFavActive: React.Dispatch<React.SetStateAction<boolean>>;
    favCount: number;
    variant?: string;
    setFavCount: React.Dispatch<React.SetStateAction<number>>;
}

export const FavoriteButton = ({article, favActive, setFavActive, favCount, setFavCount, variant} : Props) => {
    const dispatch = useAppDispatch()
    const {token} = useAppSelector(store => store.userReducer)

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

    return <Button variant={`${variant ? variant : "outline-primary"}`} size="sm" active={!!token && favActive} onClick={handleFavorite}>
        <FontAwesomeIcon icon={faHeart} className="small me-2"/> 
        {favCount}
    </Button>
}