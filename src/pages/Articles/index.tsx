import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  fetchFeedArticles,
  fetchGlobalArticles,
  setCurrentFavSlug,
} from "store/articlesSlice";
import { ParamsArticle, Tab } from "models";
import { Pagination } from "components/Pagination";
import { useNavigate } from "react-router-dom";
import { ContentWrapper } from "components/Layout/ContentWrapper";
import { Heading } from "components/Layout/Heading";
import { PopularTags } from "components/Tags/PopularTags";
import { Tabs } from "components/Tabs";
import { ListArticle } from "components/ListArticle";
import "./style.scss";
import { TagSelect } from "components/Tags/TagSelect";
import { fetchTags, setCurrentTag } from "store/tagsSlice";

export const Articles = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentFavSlug } = useAppSelector((store) => store.articlesReducer);
  const { articlesCount } = useAppSelector((store) => store.articlesReducer);
  const { token } = useAppSelector((store) => store.userReducer);
  const { currentTag } = useAppSelector((store) => store.tagsReducer);

  const uppercaseFirstChar = (string: string) => {
    return string[0].toUpperCase() + string.slice(1);
  };

  // tabs
  const listTabs = [
    {
      name: Tab.FEED,
      hide: !token,
      disabled: false,
      content: uppercaseFirstChar(Tab.FEED),
    },
    {
      name: Tab.GLOBAL,
      hide: false,
      disabled: false,
      content: uppercaseFirstChar(Tab.GLOBAL),
    },
    {
      name: Tab.TAG,
      hide: currentTag === "",
      disabled: true,
      content: currentTag ? `# ${uppercaseFirstChar(currentTag)}` : "",
    },
  ];
  const defaultTab: Tab = token ? Tab.FEED : Tab.GLOBAL;
  const [currentTab, setCurrentTab] = useState<Tab>(defaultTab);
  // pagination
  const limit = 10;
  const pagesCount = useMemo(() => {
    return Math.ceil(articlesCount / limit);
  }, [articlesCount]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const params: ParamsArticle = {
    limit,
    offset: (currentPage - 1) * limit,
  };

  useEffect(() => {
    dispatch(fetchTags());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token) {
      if (currentFavSlug) {
        navigate(`/article/${currentFavSlug}`);
        dispatch(setCurrentFavSlug(null));
      } else {
        setCurrentTab(Tab.FEED);
        setCurrentPage(1);
      }
    } else {
      setCurrentTab(Tab.GLOBAL);
      setCurrentPage(1);
    }
    dispatch(setCurrentTag(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (currentTag) {
      dispatch(
        fetchGlobalArticles({
          ...params,
          tag: currentTag,
        })
      );
    } else if (currentTab === Tab.GLOBAL) {
      dispatch(fetchGlobalArticles(params));
    } else if (token && currentTab === Tab.FEED) {
      dispatch(fetchFeedArticles(params));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentTag, currentTab]);

  useEffect(() => {
    const pagiTimeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    return () => {
      clearTimeout(pagiTimeout);
    };
  }, [currentPage]);

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    dispatch(setCurrentTag(""));
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    dispatch(setCurrentTag(tag));
    setCurrentPage(1);
    setCurrentTab(Tab.TAG);
    window.scrollTo(0, 0);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrentTag(e.target.value));
    setCurrentPage(1);
    if (e.target.value !== "") {
      setCurrentTab(Tab.TAG);
    }
  };

  return (
    <div>
      {!token && (
        <Heading>
          <div className="h1 ">conduit</div>
          <div className="h5 fw-light">A place to share your knowledge.</div>
        </Heading>
      )}
      <ContentWrapper>
        <Row className="my-4">
          <Col xs={3} className="popular-tags">
            <div className="sticky-top" style={{ top: "88px" }}>
              <PopularTags
                currentTag={currentTag}
                handleTagClick={handleTagClick}
              />
            </div>
          </Col>
          <Col xs={12} md={9}>
            <Tabs
              listTabs={listTabs}
              handleTabChange={handleTabChange}
              currentTab={currentTab}
            />
            <div className="tag-select mb-4">
              <TagSelect
                currentTag={currentTag}
                handleTagChange={handleTagChange}
              />
            </div>
            {/* List article */}
            <ListArticle limit={limit} />
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
