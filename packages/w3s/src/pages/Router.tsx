import React from "react"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import { StaticRouter } from "react-router-dom/server"

import InternalServerError from "../containers/errors/InternalServerError/InternalServerError"
import DefaultLayout from "../layouts/DefaultLayout"
import MainPage from "./MainPage"
import NotFoundPage from "./NotFoundPage"

const PathSentinel = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()

  // Allowed keys from GTM
  const allowedGtmParams = ["gtm_debug", "gtm_preview", "id"]

  const currentPath = location.pathname
  const searchParams = new URLSearchParams(location.search)

  const hasSearchParams = searchParams.toString() !== ""
  const isFromGtm = Array.from(searchParams.keys()).some(key =>
    allowedGtmParams.includes(key)
  )

  if (currentPath !== "/" || (hasSearchParams && !isFromGtm)) {
    return <NotFoundPage />
  }

  return <React.Fragment>{children}</React.Fragment>
}

const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={"/"} element={<PathSentinel><DefaultLayout /></PathSentinel>}
        errorElement={
          isBrowser
            ? (
              <InternalServerError
                error={undefined}
                resetErrorBoundary={() => { isBrowser && document.location.reload() }}
              />
            ) : undefined
        }
      >
        <Route index element={<MainPage />} />
      </Route>
      <Route path={"*"} element={<NotFoundPage />} />
    </Routes>
  );
}

const RouterKind = isBrowser ? BrowserRouter : StaticRouter;

const Router = ({ url }: { url?: string }) => {
  return (<RouterKind location={url ?? "/"}><AppRoutes /></RouterKind>);
}

export default Router
