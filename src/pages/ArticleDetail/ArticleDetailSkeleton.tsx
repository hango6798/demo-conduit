import Skeleton from "react-loading-skeleton";
import "./style.scss";
import { ContentWrapper } from "components/Layout/ContentWrapper";
import { Heading } from "components/Layout/Heading";

export const ArticleDetailSkeleton = () => {
  return (
    <div className="mb-5">
      <Heading background="dark" color="white">
        <div className="text-start">
          <div className="h2 mb-4">
            <Skeleton count={2} />
          </div>
          <div className="d-flex align-items-center flex-wrap">
            <div className="me-3 mb-2" style={{ width: "40%" }}>
              <Skeleton height={45} />
            </div>
          </div>
        </div>
      </Heading>
      <ContentWrapper>
        <div className="my-4">
          <Skeleton count={10} />
        </div>
        <hr className="my-4" />
        <div className="d-flex align-items-center flex-wrap justify-content-center">
          <div className="me-3 mb-2" style={{ width: "40%" }}>
            <Skeleton height={45} />
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};
