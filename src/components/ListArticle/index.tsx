import { Article } from "models";
import { ArticleItem } from "components/ArticleItem";
import { ArticleSkeleton } from "components/ArticleItem/ArticleSkeleton";
import { useAppSelector } from "store/hooks";

export const ListArticle = () => {
  const { status, articles } = useAppSelector((store) => store.articlesReducer);
  if (status.articles === "failed") {
    return <div className="text-center h4">Get Data Failed!</div>;
  }
  if (status.articles === "loading") {
    return (
      <div className="w-100">
        {Array(2)
          .fill(0)
          .map((item, index: number) => {
            return (
              <div key={index} className="mb-3 w-100">
                <ArticleSkeleton />
              </div>
            );
          })}
      </div>
    );
  }
  if (!articles.length) {
    return <div className="text-center h4">No articles are here... yet.</div>;
  }
  return (
    <div>
      {articles.map((article: Article, index: number) => {
        return (
          <div key={index} className="mb-2">
            <ArticleItem article={article} />
          </div>
        );
      })}
    </div>
  );
};
