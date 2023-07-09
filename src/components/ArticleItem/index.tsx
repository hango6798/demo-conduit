import { ListGroup } from "react-bootstrap";
import { Article } from "models";
import { Link, useLocation } from "react-router-dom";
import "./style.scss";
import { FavoriteButton } from "components/FavoriteButton";
import Author from "components/Author";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useMemo } from "react";
import formatTime from "utils/formatTime";
import { fetchGlobalArticles } from "store/articlesSlice";
import { setCurrentTag } from "store/tagsSlice";

interface Props {
  article: Article;
}

export const ArticleItem = ({ article }: Props) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { currentTag } = useAppSelector((store) => store.tagsReducer);
  const articleUrl = `/demo-conduit/article/${article.slug}`;
  const limit = 10;

  const currentPage = useMemo(() => {
    return location.pathname.split("/")[1];
  }, [location]);

  const author = article.author;
  const createdTime = useMemo(() => {
    return formatTime(article.createdAt);
  }, [article.createdAt]);

  const handleTagClick = (tag: string) => {
    if (currentPage === "profiles" || tag === currentTag) return;
    dispatch(setCurrentTag(tag));
    dispatch(
      fetchGlobalArticles({
        limit,
        tag,
        offset: 0,
      })
    );
  };

  return (
    <div className="p-3 article-item rounded bg-white">
      <div className="d-flex justify-content-between align-items-center">
        <Author author={author} createdTime={createdTime} variant="light" />
        <FavoriteButton article={article} size="sm" />
      </div>

      <hr className="mt-3 mb-2" />
      <Link to={articleUrl} className="title text-dark h5 mb-2 truncate-2">
        {article.title}
      </Link>

      <div className="desc small text-secondary truncate-3">
        {article.description}
      </div>

      <div className="d-flex mt-2 align-items-center justify-content-between flex-wrap">
        <ListGroup
          className="d-flex flex-row flex-wrap tag-list"
          style={{ margin: "0 -0.25rem" }}
        >
          {article.tagList.map((tag: string, index: number) => {
            return (
              <ListGroup.Item
                key={index}
                style={{ cursor: "pointer" }}
                className={`border rounded small text-secondary p-0 px-2 pb-1 mx-1 ${
                  tag === currentTag && "border-secondary"
                }`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </ListGroup.Item>
            );
          })}
        </ListGroup>

        <Link
          to={articleUrl}
          className="text-secondary fw-normal small readmore"
        >
          Read more...
        </Link>
      </div>
    </div>
  );
};
