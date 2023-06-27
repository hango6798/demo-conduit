import React, { useEffect, useMemo, useState } from "react";
import { GlobalOutlined, HomeOutlined, TagOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout as LayoutAntd, Menu } from "antd";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { fetchTags, setCurrentTag } from "store/tagsSlice";
import { ListArticle } from "components/ListArticle";
import { ParamsArticle, Tab } from "models";
import {
  fetchFeedArticles,
  fetchGlobalArticles,
  setCurrentFavSlug,
} from "store/articlesSlice";
import { useNavigate } from "react-router-dom";
import { Pagination } from "components/Pagination";
import "./style.scss";

const { Sider } = LayoutAntd;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export const Articles = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tags, currentTag } = useAppSelector((store) => store.tagsReducer);
  const { user } = useAppSelector((store) => store.userReducer);
  const { articles, currentFavSlug } = useAppSelector(
    (store) => store.articlesReducer
  );
  const articlesCount: number = useMemo(() => {
    return articles?.articlesCount || 0;
  }, [articles]);

  const items: MenuItem[] = [
    user ? getItem("Feed", Tab.FEED, <HomeOutlined />) : null,
    getItem("Global", Tab.GLOBAL, <GlobalOutlined />),
    getItem(
      "Popular tags",
      Tab.TAG,
      <TagOutlined />,
      tags.map((tag: string) => {
        if (tag.trim() !== "") {
          return getItem(tag, tag);
        }
        return null;
      })
    ),
  ];

  useEffect(() => {
    !tags.length && dispatch(fetchTags());
  }, [dispatch, tags]);

  // List Article
  const [currentTab, setCurrentTab] = useState<Tab | undefined>(undefined);

  useEffect(() => {
    dispatch(setCurrentTag(null));
    if (!user) {
      setCurrentTab(Tab.GLOBAL);
      return;
    }

    if (currentFavSlug) {
      navigate(`/article/${currentFavSlug}`);
      dispatch(setCurrentFavSlug(null));
    } else {
      setCurrentTab(Tab.FEED);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Pagination
  const limit = 10;
  const pagesCount = useMemo(() => {
    return Math.ceil(articlesCount / limit);
  }, [articlesCount]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleTabChange = ({ key }: any) => {
    setCurrentPage(1);
    switch (key) {
      case Tab.FEED:
        setCurrentTab(Tab.FEED);
        dispatch(setCurrentTag(null));
        break;
      case Tab.GLOBAL:
        setCurrentTab(Tab.GLOBAL);
        dispatch(setCurrentTag(null));
        break;
      default:
        setCurrentTab(Tab.TAG);
        dispatch(setCurrentTag(key));
        break;
    }
  };

  useEffect(() => {
    const params: ParamsArticle = {
      limit,
      offset: (currentPage - 1) * limit,
    };

    if (currentTag) {
      dispatch(
        fetchGlobalArticles({
          ...params,
          tag: currentTag,
        })
      );
      return;
    }

    if (currentTab === Tab.GLOBAL) {
      dispatch(fetchGlobalArticles(params));
    } else if (user && currentTab === Tab.FEED) {
      dispatch(fetchFeedArticles(params));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentTag, currentTab, dispatch]);

  return (
    <LayoutAntd
      hasSider
      style={{
        overflow: "hidden",
        height: "calc(100vh - 64px)",
        position: "fixed",
        left: 0,
        top: 64,
        bottom: 0,
        width: "100%",
      }}
    >
      <Sider breakpoint="md" collapsedWidth="0" theme="light">
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          defaultSelectedKeys={[user ? Tab.FEED : Tab.GLOBAL]}
          mode="inline"
          items={items}
          className="text-secondary py-1"
          onSelect={handleTabChange}
          selectedKeys={[currentTag || currentTab || Tab.GLOBAL]}
        />
      </Sider>
      <div className="content w-100 p-2" style={{ overflowY: "auto" }}>
        <ListArticle />
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pagesCount={pagesCount}
        />
      </div>
    </LayoutAntd>
  );
};
