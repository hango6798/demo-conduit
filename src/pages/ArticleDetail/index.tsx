import { Link, useNavigate, useParams } from "react-router-dom";
import { Heading } from "components/Layout/Heading";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useEffect, useState } from "react";
import {
  deleteArticle,
  getCurrentArticle,
  setCurrentArticleFollow,
} from "store/articlesSlice";
import Author from "components/Author";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FavoriteButton } from "components/FavoriteButton";
import { ContentWrapper } from "components/Layout/ContentWrapper";
import { unfollow, follow } from "store/profilesSlice";
import { setPopupType, setShowPopup } from "store/userSlice";
import "./style.scss";
import { ArticleDetailSkeleton } from "components/Skeleton/ArticleDetailSkeleton";
import CommentForm from "components/Comments/CommentForm";
import { ListComments } from "components/Comments/ListComments";

export const ArticleDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const parser = new DOMParser();
  const dispatch = useAppDispatch();

  // get global state from store
  const { comments } = useAppSelector((store) => store.commentsReducer);
  const { user } = useAppSelector((store) => store.userReducer);
  const { currentArticle, status: articleStatus } = useAppSelector(
    (store) => store.articlesReducer
  );
  const { status: profileStatus } = useAppSelector(
    (store) => store.profilesReducer
  );
  const { token } = useAppSelector((store) => store.userReducer);

  const createdTime = new Date(currentArticle.createdAt).toLocaleString(
    "en-us",
    { month: "long", day: "numeric", year: "numeric" }
  );
  const articleBodyHTML = parser.parseFromString(
    currentArticle.body.replaceAll("\\n", "<br />"),
    "text/html"
  ).body;

  const author = currentArticle.author;
  const isUserPost = user.username === author.username;

  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    !!slug && dispatch(getCurrentArticle(slug));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFollow = () => {
    const username = author.username;
    if (token) {
      const setFollowing = (state: boolean) => {
        dispatch(setCurrentArticleFollow(state));
        dispatch(state ? follow(username) : unfollow(username)).catch((err) => {
          dispatch(setCurrentArticleFollow(state));
        });
      };
      author.following ? setFollowing(false) : setFollowing(true);
    } else {
      dispatch(setPopupType("login"));
      dispatch(setShowPopup(true));
    }
  };

  const handleDeleteArticle = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Delete this article?")) {
      !!slug &&
        dispatch(deleteArticle(slug))
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            console.log(error);
            alert("Try again!");
          });
    }
  };

  if (articleStatus.currentArticle === "failed") {
    return <div className="h3 text-center my-5">Get data failed!</div>;
  }
  if (articleStatus.currentArticle === "loading") {
    return <ArticleDetailSkeleton />;
  }

  return (
    <div className="mb-5">
      <Heading background="dark" color="white">
        <div className="text-start">
          <div className="h2 mb-4">{currentArticle.title}</div>
          <div className="d-flex align-items-center flex-wrap">
            <div className="d-flex align-items-center me-3 mb-2">
              <Author
                author={author}
                createdTime={createdTime}
                variant="dark"
              />
            </div>
            {isUserPost ? (
              <div className="d-flex align-items-center">
                <Link
                  className="btn btn-outline-light me-2 fw-bold small"
                  to={`/editor/${slug}`}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit article
                </Link>
                <Button variant="outline-danger" onClick={handleDeleteArticle}>
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Delete article
                </Button>
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <Button
                  variant={author.following ? "light" : "outline-light"}
                  className="me-2 fw-bold"
                  size="sm"
                  onClick={handleFollow}
                  disabled={profileStatus.follow === "loading"}
                >
                  <FontAwesomeIcon
                    icon={author.following ? faMinus : faPlus}
                    className="me-2"
                  />
                  {author.following ? "Unfollow" : "Follow"}
                </Button>
                <FavoriteButton
                  article={currentArticle}
                  variant="outline-primary"
                />
              </div>
            )}
          </div>
        </div>
      </Heading>
      <ContentWrapper>
        {/* Article Body */}
        <div className="my-4">
          <div
            dangerouslySetInnerHTML={{ __html: articleBodyHTML.innerHTML }}
          ></div>
        </div>
        <ul className="tags d-flex flex-wrap">
          {currentArticle.tagList &&
            currentArticle.tagList.map((tag: string, index: number) => {
              return (
                <li
                  key={index}
                  className="mx-1 mb-1 rounded border px-2 py-1 small text-secondary"
                >
                  {tag}
                </li>
              );
            })}
        </ul>
        <hr className="my-4" />
        <div className="d-flex align-items-center flex-wrap justify-content-center mb-4">
          <div className="d-flex align-items-center me-3 mb-2">
            <Author author={author} createdTime={createdTime} variant="light" />
          </div>
          {isUserPost ? (
            <div className="d-flex align-items-center">
              <Link
                className="btn btn-outline-secondary me-2 fw-bold small"
                to={`/editor/${slug}`}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit article
              </Link>
              <Button variant="outline-danger" onClick={handleDeleteArticle}>
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete article
              </Button>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <Button
                variant={author.following ? "success" : "outline-success"}
                className="me-2 fw-bold"
                size="sm"
                onClick={handleFollow}
                disabled={profileStatus.follow === "loading"}
              >
                <FontAwesomeIcon
                  icon={author.following ? faMinus : faPlus}
                  className="me-2"
                />
                {author.following ? "Unfollow" : "Follow"}
              </Button>
              <FavoriteButton
                article={currentArticle}
                variant="outline-primary"
              />
            </div>
          )}
        </div>
        {/* Comments */}
        <div>
          <CommentForm slug={slug || ""} setCurrentPage={setCurrentPage} />
          {!!comments && (
            <ListComments
              slug={slug || ""}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </ContentWrapper>
    </div>
  );
};
