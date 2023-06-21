import { Link, useParams } from "react-router-dom";
import { Heading } from "components/Layout/Heading";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getProfile } from "store/profilesSlice";
import { Col, Image, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { ContentWrapper } from "components/Layout/ContentWrapper";
import { Tabs } from "components/Tabs";
import { Pagination } from "components/Pagination";
import { ParamsArticle, Tab } from "models";
import { ListArticle } from "components/ListArticle";
import { fetchGlobalArticles } from "store/articlesSlice";
import { FollowButton } from "components/FollowButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

export const Profile = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const { user } = useAppSelector((store) => store.userReducer);
  const { articlesCount } = useAppSelector((store) => store.articlesReducer);
  const { profile, status } = useAppSelector((store) => store.profilesReducer);

  const usernameParam: string = params.username
    ? params?.username?.replace("@", "")
    : "";

  const isUserProfile = !!user && user.username === usernameParam;
  const currentProfile: any = isUserProfile ? user : profile;
  const following = currentProfile.following;

  useEffect(() => {
    !isUserProfile && dispatch(getProfile(usernameParam));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameParam]);

  // List Articles

  // tabs
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.MY_ARTICLES);
  const listTabs = [
    {
      name: Tab.MY_ARTICLES,
      hide: false,
      disabled: false,
      content: "My Articles",
    },
    {
      name: Tab.FAVORITED,
      hide: false,
      disabled: false,
      content: "Favorited Articles",
    },
  ];
  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    setCurrentPage(1);
  };
  // pagination
  const limit = 5;
  const pagesCount = useMemo(() => {
    return Math.ceil(articlesCount / limit);
  }, [articlesCount]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articleParams: ParamsArticle = {
    limit: limit,
    offset: (currentPage - 1) * limit,
  };

  useEffect(() => {
    setCurrentTab(Tab.MY_ARTICLES);
    setCurrentPage(1);
  }, [usernameParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab]);

  useEffect(() => {
    if (currentTab === Tab.MY_ARTICLES) {
      dispatch(
        fetchGlobalArticles({
          ...articleParams,
          author: usernameParam,
        })
      );
    } else if (currentTab === Tab.FAVORITED) {
      dispatch(
        fetchGlobalArticles({
          ...articleParams,
          favorited: usernameParam,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentTab]);

  return (
    <div>
      <Heading>
        {status.getProfile === "loading" && (
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
        {status.getProfile === "idle" && currentProfile.username && (
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
                following={following}
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
        <Row className="my-4">
          <Col xs={12}>
            <Tabs
              listTabs={listTabs}
              handleTabChange={handleTabChange}
              currentTab={currentTab}
            />
          </Col>
          <Col xs={12}>
            {/* list articles */}
            <ListArticle />
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pagesCount={pagesCount}
            />
          </Col>
        </Row>
      </ContentWrapper>
    </div>
  );
};
