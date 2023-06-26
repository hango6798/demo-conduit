import { Link, useNavigate, useParams } from "react-router-dom";
import { Heading } from "components/Layout/Heading";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useEffect, useMemo, useState } from "react";
import { deleteArticle, getCurrentArticle } from "store/articlesSlice";
import Author from "components/Author";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FavoriteButton } from "components/FavoriteButton";
import { ContentWrapper } from "components/Layout/ContentWrapper";
import "./style.scss";
import { ArticleDetailSkeleton } from "pages/ArticleDetail/ArticleDetailSkeleton";
import CommentForm from "components/Comments/CommentForm";
import ListComments from "components/Comments/ListComments";
import { FollowButton } from "components/FollowButton";
import { ConfirmDelete } from "components/Popup/ConfirmDelete";
import { getComments } from "store/commentsSlice";
import formatTime from "utils/formatTime";
import showdown from "showdown";

export const ArticleDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const converter = new showdown.Converter();
  // get global state from store
  const { comments } = useAppSelector((store) => store.commentsReducer);
  const { user } = useAppSelector((store) => store.userReducer);
  const { currentArticle, status: articleStatus } = useAppSelector(
    (store) => store.articlesReducer
  );

  const createdTime = useMemo(() => {
    return formatTime(currentArticle.createdAt);
  }, [currentArticle.createdAt]);

  const updatedTime = useMemo(() => {
    if (currentArticle.updatedAt === currentArticle.createdAt) {
      return null;
    }
    return formatTime(currentArticle.updatedAt);
  }, [currentArticle.createdAt, currentArticle.updatedAt]);

  const author = currentArticle.author;
  const isUserPost = !!user && user.username === author.username;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    if (slug && (slug !== currentArticle.slug || !currentArticle.slug)) {
      dispatch(getCurrentArticle(slug));
      dispatch(getComments(slug));
    }
  }, [dispatch, slug, currentArticle]);

  const handleDeleteArticle = () => {
    !!slug &&
      dispatch(deleteArticle(slug)).then((res) => {
        res.meta.requestStatus === "rejected"
          ? alert("Try again!")
          : navigate("/");
      });
    setShowConfirmDelete(false);
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
          <div className="d-flex align-items-end justify-content-between flex-wrap">
            <div className="d-flex align-items-center flex-wrap">
              {/* author */}
              <div className="d-flex align-items-center me-3 mb-2 mb-sm-0">
                <Author
                  author={author}
                  createdTime={createdTime}
                  variant="dark"
                />
              </div>
              {/* Buttons */}
              {isUserPost ? (
                <div className="d-flex align-items-center">
                  <Link
                    className="btn btn-outline-light me-2 fw-bold small"
                    to={`/editor/${slug}`}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Edit article
                  </Link>
                  <Button
                    variant="outline-danger"
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Delete article
                  </Button>
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <FollowButton
                    following={author.following}
                    username={author.username}
                    size="sm"
                    className="me-2"
                  />
                  <FavoriteButton article={currentArticle} size="sm" />
                </div>
              )}
            </div>
            {/* updated time */}
            {updatedTime && (
              <div className="opacity-50 small mt-2 mt-sm-0">
                Updated: {updatedTime}
              </div>
            )}
          </div>
        </div>
      </Heading>
      <ContentWrapper>
        {/* Article Body */}
        <div
          className="my-4"
          dangerouslySetInnerHTML={{
            __html: converter.makeHtml(currentArticle.body),
          }}
        ></div>
        {/* Tag list */}
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
              <Button
                variant="outline-danger"
                onClick={() => setShowConfirmDelete(true)}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete article
              </Button>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <FollowButton
                following={author.following}
                username={author.username}
                size="sm"
                className="me-2"
                variant="success"
              />
              <FavoriteButton article={currentArticle} size="sm" />
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
      <ConfirmDelete
        onConfirm={handleDeleteArticle}
        show={showConfirmDelete}
        setShow={setShowConfirmDelete}
        message="Are you sure you want to delete this article?"
      />
    </div>
  );
};
