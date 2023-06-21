import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { Popup, setShowPopup } from "store/userSlice";
import { Article } from "models";
import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import articlesApi from "api/articlesApi";
import { setCurrentArticle, setCurrentFavSlug } from "store/articlesSlice";

interface Props {
  article: Article;
  variant?: string;
  className?: string;
  size?: "sm" | "lg" | undefined;
}

export const FavoriteButton = ({
  article,
  variant: v,
  className,
  size,
}: Props) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.userReducer);
  const { currentArticle } = useAppSelector((store) => store.articlesReducer);
  const [favorited, setFavorited] = useState<boolean>(article.favorited);
  const [favoritesCount, setFavoritesCount] = useState<number>(
    article.favoritesCount
  );
  const [isFavoriting, setIsFavoriting] = useState(false);
  const variant = useMemo(() => {
    if (v) {
      return favorited ? v : `outline-${v}`;
    }
    return favorited ? "primary" : "outline-primary";
  }, [v, favorited]);

  useEffect(() => {
    setFavorited(article.favorited);
    setFavoritesCount(article.favoritesCount);
  }, [article]);

  const toggleFavorite = () => {
    if (!user) {
      dispatch(
        setShowPopup({
          name: Popup.LOGIN,
          open: true,
        })
      );
      dispatch(setCurrentFavSlug(article.slug));
      return;
    }

    setIsFavoriting(true);
    setFavorited(!favorited);
    setFavoritesCount(favorited ? favoritesCount - 1 : favoritesCount + 1);

    const api = favorited ? articlesApi.unfavorite : articlesApi.favorite;
    api(article.slug)
      .then((r) => {
        setFavorited(r.data.article.favorited);
        setFavoritesCount(r.data.article.favoritesCount);
        dispatch(
          setCurrentArticle({
            ...currentArticle,
            favorited: r.data.article.favorited,
            favoritesCount: r.data.article.favoritesCount,
          })
        );
      })
      .catch((error) => {
        console.log(error);
        setFavorited(!favorited);
        setFavoritesCount(favorited ? favoritesCount - 1 : favoritesCount + 1);
      })
      .finally(() => {
        setIsFavoriting(false);
      });
  };
  return (
    <Button
      variant={variant}
      onClick={toggleFavorite}
      disabled={isFavoriting}
      size={size || undefined}
      style={{ fontWeight: "600" }}
      className={className || ""}
    >
      <FontAwesomeIcon icon={faHeart} className="small me-2" />
      {favoritesCount}
    </Button>
  );
};
