import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  createComment,
  deleteComment,
  getComments,
} from "@store/commentsSlice";
import { Comment } from "@models";
import { faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import "./style.scss";
import { setPopupType, setShowPopup } from "@store/userSlice";
import { Pagination } from "../Pagination";
import Skeleton from "react-loading-skeleton";

interface Props {
  slug: string | undefined;
}

export const Comments = ({ slug }: Props) => {
  const dispatch = useAppDispatch();

  const { token, user } = useAppSelector((store) => store.userReducer);
  const { comments, status: commentStatus } = useAppSelector(
    (store) => store.commentsReducer
  );

  const postingComment = commentStatus.createComment === "loading";
  const gettingComment = commentStatus.getComments === "loading";

  // refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);

  // state
  const [commentText, setCommentText] = useState<string>("");

  useEffect(() => {
    slug && dispatch(getComments(slug));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const sortedComment = useMemo(() => {
    const result = [...comments];
    if (comments.length > 1) {
      return result.sort((a: Comment, b: Comment) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
    }
    return result;
  }, [comments]);

  // Comment Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;
  const pagesCount = Math.ceil(comments.length / limit);

  const idOfLastComment = limit * currentPage;
  const idOfFirstComment = idOfLastComment - limit;

  const currentComment = sortedComment.slice(idOfFirstComment, idOfLastComment);

  // useEffect(() => {
  //     if(commentRef.current){
  //         const commentEl = commentRef.current
  //         const top = commentEl.offsetTop
  //         window.scrollTo({top})
  //     }
  // }, [currentPage])

  // Comment events

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const top = textarea.scrollTop;
      const height = textarea.offsetHeight;
      if (e.target.value === "") {
        textarea.style.height = 62 + "px";
      } else if (top > 0) {
        textarea.style.height = top + height + "px";
      }
    }
  };

  const postComment = () => {
    if (commentText.trim() !== "") {
      slug && dispatch(createComment({ slug, comment: commentText }));
      setCommentText("");
      setCurrentPage(1);
    }
  };

  const handleEnterComment = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      postComment();
      return false;
    }
  };

  const handleSignInClick = () => {
    dispatch(setPopupType("login"));
    dispatch(setShowPopup(true));
  };

  const handleDeleteComment = (commentId: number) => {
    slug && dispatch(deleteComment({ slug, commentId }));
  };

  const getCreatedTime = (time: string) => {
    return new Date(time).toLocaleString("en-us", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  return (
    <div ref={commentRef}>
      {/* Create comment form */}
      {token ? (
        <Form
          className="mb-4 comment-area shadow-sm border text-light p-2 rounded"
          onSubmit={postComment}
        >
          {user.username && (
            <Link
              to={`/profiles/@${user.username}`}
              className="avatar border border-light border-2 rounded"
            >
              <Image src={user.image} width={40} height={40} rounded />
            </Link>
          )}
          <div className="comment-textarea">
            <Form.Group>
              <Form.Control
                as="textarea"
                placeholder="Write a comment..."
                value={commentText}
                onChange={handleChangeComment}
                onKeyDown={handleEnterComment}
                ref={textareaRef}
              />
            </Form.Group>
            <div
              className={`text-secondary fs-4 btn-post ${
                commentText === "" ? "disabled" : "active"
              }`}
              style={{ cursor: "pointer" }}
              onClick={postComment}
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                className={postingComment ? "disabled" : ""}
              />
            </div>
          </div>
        </Form>
      ) : (
        <div className="text-center mb-4">
          <Button variant="primary me-1" onClick={handleSignInClick}>
            Sign In
          </Button>{" "}
          to add comments on this article.
        </div>
      )}
      {/* Loading comments */}
      {gettingComment && <div className="text-center">Loading comments...</div>}
      {/* posting comment skeleton */}
      {postingComment && (
        <div className="mb-3 d-flex align-items-start comment-item">
          <Skeleton width={40} height={40} className="rounded me-2" />
          <div className="comment-detail p-2 shadow-sm rounded border ">
            <Skeleton width={200} height={16} className="mb-2" />
            <Skeleton count={2} height={20} />
          </div>
        </div>
      )}
      {/* List comments */}
      {!!comments.length &&
        currentComment.map((comment: Comment) => {
          return (
            <div
              key={comment.id}
              className="mb-3 d-flex align-items-start comment-item"
            >
              <Link
                to={`/profiles/@${comment.author.username}`}
                className="avatar"
              >
                <Image
                  src={comment.author.image}
                  width={40}
                  height={40}
                  rounded
                />
              </Link>
              <div className="comment-detail p-2 shadow-sm rounded border ">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="d-flex align-items-center flex-wrap">
                    <Link
                      to={`/profiles/@${comment.author.username}`}
                      className="text-secondary fw-medium author-name me-2"
                    >
                      {comment.author.username}
                    </Link>
                    <span className="opacity-75 small time">
                      {getCreatedTime(comment.createdAt)}
                    </span>
                  </div>
                  {user.username === comment.author.username && (
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-secondary btn-delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    />
                  )}
                </div>
                <div>{comment.body}</div>
              </div>
            </div>
          );
        })}
      {/* Pagination */}
      {pagesCount > 1 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pagesCount={pagesCount}
        />
      )}
    </div>
  );
};
