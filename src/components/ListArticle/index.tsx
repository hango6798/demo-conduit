import { ListGroup, Row, Col } from "react-bootstrap";
import { Article } from "@models";
import { ArticleItem } from "./ArticleItem";
import { ArticleSkeleton } from "@components/Skeleton/ArticleSkeleton";
import { useAppSelector } from "@store/hooks";

interface Props {
  limit: number;
}

export const ListArticle = ({ limit }: Props) => {
  const { status, articles } = useAppSelector((store) => store.articlesReducer);
  return (
    <>
      <ListGroup className="border-0">
        <Row>
          {status.articles === "failed" && (
            <Col xs={12} className="text-center">
              Get Data Failed!
            </Col>
          )}
          {status.articles === "loading" &&
            Array(limit)
              .fill(0)
              .map((item, index: number) => {
                return (
                  <Col xs={12} key={index} className="mb-3">
                    <ArticleSkeleton />
                  </Col>
                );
              })}
          {status.articles === "idle" &&
            (articles.length === 0 ? (
              <div className="text-center">No articles are here... yet.</div>
            ) : (
              articles.map((article: Article, index: number) => {
                return (
                  <Col xs={12} key={index} className="mb-4">
                    <ArticleItem article={article} />
                  </Col>
                );
              })
            ))}
        </Row>
      </ListGroup>
    </>
  );
};
