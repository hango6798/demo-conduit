import Skeleton from "react-loading-skeleton";
import "./style.scss";
import { ListGroup } from "react-bootstrap";
import { AuthorSkeleton } from "components/Author/AuthorSkeleton";

export const ArticleSkeleton = () => {
  return (
    <div className="p-3 border rounded h-100 bg-white article-item">
      <div className="d-flex justify-content-between align-items-center">
        <AuthorSkeleton />
        <Skeleton width={70} height={30} />
      </div>
      <hr className="mt-3 mb-2" />
      <Skeleton count={2} />
      <Skeleton height={43} />
      <div className="d-flex mt-2 align-items-center justify-content-between">
        <ListGroup
          className="d-flex flex-row flex-wrap tag-list"
          style={{ margin: "0 -0.25rem" }}
        >
          <Skeleton
            width={50}
            height={25}
            className="mx-1"
            style={{ flex: 1 }}
          />
          <Skeleton
            width={50}
            height={25}
            className="mx-1"
            style={{ flex: 1 }}
          />
          <Skeleton
            width={50}
            height={25}
            className="mx-1"
            style={{ flex: 1 }}
          />
          <Skeleton
            width={50}
            height={25}
            className="mx-1"
            style={{ flex: 1 }}
          />
        </ListGroup>
        <Skeleton width={70} />
      </div>
    </div>
  );
};
