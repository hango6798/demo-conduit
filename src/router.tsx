import { Navigate, createBrowserRouter } from "react-router-dom";
import { Layout } from "components/Layout";
import { RequiredAuth } from "components/RequiredAuth";
import { ArticleDetail } from "pages/ArticleDetail";
import { Articles } from "pages/Articles";
import { Editor } from "pages/Editor";
import { Profile } from "pages/Profiles";
import { Settings } from "pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="demo-conduit" />
  }
  {
    path: "demo-conduit",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Articles />,
      },
      {
        path: "*",
        element: <div>404 - Page not found!</div>,
      },
      {
        path: "settings",
        element: (
          <RequiredAuth>
            <Settings />
          </RequiredAuth>
        ),
      },
      {
        path: "editor",
        element: (
          <RequiredAuth>
            <Editor />
          </RequiredAuth>
        ),
      },
      {
        path: "editor/:slug",
        element: (
          <RequiredAuth>
            <Editor />
          </RequiredAuth>
        ),
      },
      {
        path: "article/:slug",
        element: <ArticleDetail />,
      },
      {
        path: "profiles/:username",
        element: <Profile />,
      },
      {
        path: "profiles/:username/favorites",
        element: <Profile />,
      },
    ]
  },
]);
