import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { memo, useRef, useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createComment } from "store/commentsSlice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { setShowPopup, Popup } from "store/userSlice";
import "./style.scss";

interface Props {
  slug: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const CommentForm = ({ slug, setCurrentPage }: Props) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.userReducer);
  const { status } = useAppSelector((store) => store.commentsReducer);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [commentText, setCommentText] = useState<string>("");
  const postingComment = status.createComment === "loading";

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const top = textarea.scrollTop;
    const height = textarea.offsetHeight;
    if (e.target.value === "") {
      textarea.style.height = 62 + "px";
    }
    if (e.target.value !== "" && top > 0) {
      textarea.style.height = top + height + "px";
    }
  };

  const postComment = () => {
    if (commentText.trim() === "") return;

    dispatch(createComment({ slug, comment: commentText })).then(() => {
      setCurrentPage(1);
    });
    setCommentText("");
  };

  const handleEnterComment = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      postComment();
      return false;
    }
  };

  const handleSignIn = () => {
    dispatch(
      setShowPopup({
        name: Popup.LOGIN,
        open: true,
      })
    );
  };

  if (user) {
    return (
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
    );
  } else
    return (
      <div className="text-center mb-4">
        <Button variant="primary me-1" onClick={handleSignIn}>
          Sign In
        </Button>{" "}
        to add comments on this article.
      </div>
    );
};

export default memo(CommentForm);
