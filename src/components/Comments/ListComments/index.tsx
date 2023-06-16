import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef } from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { deleteComment, getComments } from "store/commentsSlice";
import { Comment } from "models";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { Pagination } from "components/Pagination";
import Skeleton from "react-loading-skeleton";
import "./style.scss";

interface Props {
  slug: string;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const ListComments = ({ slug, currentPage, setCurrentPage }: Props) => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((store) => store.userReducer);
  const { comments, status: commentStatus } = useAppSelector(
    (store) => store.commentsReducer
  );

  const postingComment = commentStatus.createComment === "loading";
  const gettingComment = commentStatus.getComments === "loading";

  // refs
  const commentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    !!slug && dispatch(getComments(slug));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const sortedComment = useMemo(() => {
    if (!!comments.length) {
      return [...comments].sort((a: Comment, b: Comment) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
    }
    return [];
  }, [comments]);

  // Comment Pagination
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

  const handleDeleteComment = (commentId: number) => {
    dispatch(deleteComment({ slug, commentId }));
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
      {gettingComment && <div className="text-center mb-2">Loading...</div>}
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
      {currentComment.map((comment: Comment) => {
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