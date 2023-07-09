import { Link } from "react-router-dom";
import { Author as AuthorType } from "models";
import { Image } from "react-bootstrap";
import { memo } from "react";

interface Props {
  author: AuthorType;
  createdTime: string;
  variant: "light" | "dark";
}

const Author = ({ author, createdTime, variant }: Props) => {
  const authorUrl = `/demo-conduit/profiles/@${author.username}`;
  const dark = variant === "dark";

  return (
    <div className="d-flex align-items-center">
      <Link to={authorUrl} className="me-2">
        <Image
          src={author.image}
          alt=""
          rounded
          width={40}
          height={40}
          className={`${dark ? "border border-white border-2" : null}`}
        />
      </Link>
      <div>
        <Link
          to={authorUrl}
          className={`${
            dark ? "text-white" : "text-dark"
          } fw-medium authorName`}
        >
          {author.username}
        </Link>
        <p
          className={`${
            dark ? "text-light opacity-50" : "text-secondary"
          } small mb-0`}
        >
          {createdTime}
        </p>
      </div>
    </div>
  );
};

export default memo(Author);
