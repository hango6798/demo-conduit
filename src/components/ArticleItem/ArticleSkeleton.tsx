import Skeleton from "react-loading-skeleton";
import "./style.scss";

export const ArticleSkeleton = () => {
  return (
    <div className="p-3 border rounded h-100 bg-white article-item">
      <div className="d-flex justify-content-between align-items-center">
        <Skeleton width={120} height={40} />
        <Skeleton width={70} height={30} />
      </div>
      <hr className="mt-3 mb-2" />
      <Skeleton height={40} className="mb-2" />
      <Skeleton count={4} />
    </div>
  );
};
