import { Link, useParams } from "react-router-dom";
import { Heading } from "components/Layout/Heading";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getProfile } from "store/profilesSlice";
import { Image } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { ContentWrapper } from "components/Layout/ContentWrapper";
import { FollowButton } from "components/FollowButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { Tabs } from "antd";
import { ListArticle } from "components/ListArticle";
import { ParamsArticle } from "models";
import { fetchGlobalArticles } from "store/articlesSlice";
import { Pagination } from "components/Pagination";

enum TabName {
  MY_ARTICLES = "myArticles",
  FAVORITED_ARTICLES = "favoritedArticles",
}

export const Profile = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const { user } = useAppSelector((store) => store.userReducer);
  const { articles, status: articlesStatus } = useAppSelector(
    (store) => store.articlesReducer
  );
  const { profile, status: profileStatus } = useAppSelector(
    (store) => store.profilesReducer
  );

  const usernameParam: string = useMemo(() => {
    return params.username ? params.username.replace("@", "") : "";
  }, [params.username]);

  const isUserProfile = useMemo(() => {
    return !!user && user.username === usernameParam;
  }, [user, usernameParam]);

  const currentProfile: any = useMemo(() => {
    return isUserProfile ? user : profile;
  }, [isUserProfile, user, profile]);

  useEffect(() => {
    !isUserProfile && dispatch(getProfile(usernameParam));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameParam, user]);

  // List Articles

  const listTabs = [
    {
      name: TabName.MY_ARTICLES,
      label: "My Articles",
    },
    {
      name: TabName.FAVORITED_ARTICLES,
      label: "Favorited Articles",
    },
  ];

  const limit = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentTab, setCurrentTab] = useState<string>(TabName.MY_ARTICLES);

  const pagesCount: number = useMemo(() => {
    return articles?.articlesCount
      ? Math.ceil(articles.articlesCount / limit)
      : 0;
  }, [articles?.articlesCount]);

  const articleParams: ParamsArticle = {
    limit: limit,
    offset: (currentPage - 1) * limit,
  };

  const getMyArticles = () => {
    dispatch(
      fetchGlobalArticles({
        ...articleParams,
        author: usernameParam,
      })
    );
  };
  const getFavoritedArticles = () => {
    dispatch(
      fetchGlobalArticles({
        ...articleParams,
        favorited: usernameParam,
      })
    );
  };

  const onChange = (key: string) => {
    setCurrentTab(key);
    currentPage !== 1 && setCurrentPage(1);
    key === TabName.MY_ARTICLES ? getMyArticles() : getFavoritedArticles();
  };

  useEffect(() => {
    if (usernameParam) {
      currentPage !== 1 && setCurrentPage(1);
      currentTab !== TabName.MY_ARTICLES && setCurrentTab(TabName.MY_ARTICLES);
      getMyArticles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameParam, user]);

  useEffect(() => {
    if (currentPage === 1) return;
    currentTab === TabName.MY_ARTICLES
      ? getMyArticles()
      : getFavoritedArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  if (!usernameParam) return null;

  return (
    <div>
      <Heading>
        {profileStatus.getProfile === "loading" && (
          <>
            <Skeleton
              width={100}
              height={100}
              className="rounded border border-white border-3 mb-2"
            />
            <Skeleton width={130} height={25} />
            <Skeleton width={100} height={36} className="mt-2" />
          </>
        )}
        {profileStatus.getProfile === "idle" && currentProfile.username && (
          <>
            <Image
              src={currentProfile.image}
              alt=""
              rounded
              className="border border-white border-3 mb-2"
              width={100}
              height={100}
            />
            <p className="h3 m-0 mb-2">{currentProfile.username}</p>
            {isUserProfile ? (
              <Link className="btn btn-outline-light fw-medium" to="/settings">
                <FontAwesomeIcon icon={faGear} className="me-2" />
                Edit profile settings
              </Link>
            ) : (
              <FollowButton
                following={currentProfile.following}
                username={currentProfile.username}
              />
            )}
          </>
        )}
      </Heading>
      <ContentWrapper>
        {currentProfile.bio && (
          <>
            <div className="text-center w-75 mx-auto mt-4">
              <p className="small opacity-75 m-0">{currentProfile.bio}</p>
            </div>
            <hr />
          </>
        )}
        {/* Tabs */}
        <Tabs
          className="mt-3"
          onChange={onChange}
          type="card"
          items={listTabs.map((tab: { label: string; name: TabName }) => {
            return {
              label: tab.label,
              key: tab.name,
              children: <ListArticle />,
            };
          })}
          activeKey={currentTab}
        />
        {articlesStatus.articles !== "loading" && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pagesCount={pagesCount}
          />
        )}
      </ContentWrapper>
    </div>
  );
};
