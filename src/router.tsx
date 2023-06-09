import { createBrowserRouter } from "react-router-dom"
import { Layout } from "./components/Layout/Layout"

export const router = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
    //   children: [
    //     {
    //       index: true,
    //       element: <Articles />
    //     },
    //     {
    //       path: '*',
    //       element: <div>404 - Page not found!</div>
    //     },
    //     {
    //       path: 'login',
    //       element: <Login />
    //     },
    //     {
    //       path: 'register',
    //       element: <Register />
    //     },
    //     {
    //       path: 'settings',
    //       element: <RequiredAuth><Settings /></RequiredAuth>
    //     },
    //     {
    //       path: 'editor',
    //       element: <RequiredAuth><Editor /></RequiredAuth>
    //     },
    //     {
    //       path: 'editor/:slug',
    //       element: <RequiredAuth><Editor /></RequiredAuth>
    //     },
    //     {
    //       path: 'article/:slug',
    //       element: <ArticleDetail />
    //     },
    //     {
    //       path: 'profile/:username',
    //       element: <RequiredAuth><Profile /></RequiredAuth>
    //     },
    //     {
    //       path: 'profile/:username/favorites',
    //       element: <RequiredAuth><Profile /></RequiredAuth>
    //     }
    //   ]
    },
])