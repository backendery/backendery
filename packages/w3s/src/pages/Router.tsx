import React from "react"
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"

import InternalServerError from "../containers/errors/InternalServerError/InternalServerError"
import DefaultLayout from "../layouts/DefaultLayout"
import MainPage from "./MainPage"
import NotFoundPage from "./NotFoundPage"

const PathSentinel = ({ children }: { children: React.ReactNode }) => {
  const currentPath = window.location.pathname
  const searchParams = new URLSearchParams(window.location.search)

  // Allowed keys from GTM
  const allowedGtmParams = ["gtm_debug", "gtm_preview", "id"]

  const hasSearchParams = searchParams.toString() !== ""
  const isFromGtm = Array.from(searchParams.keys()).some(key =>
    allowedGtmParams.includes(key)
  )

  if (currentPath !== "/" || (hasSearchParams && !isFromGtm)) {
    return <NotFoundPage />
  }

  return <React.Fragment>{children}</React.Fragment>
}

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      errorElement={
        <InternalServerError
          error={undefined}
          resetErrorBoundary={function (): void {
            document.location.reload()
          }}
        />
      }
    >
      <Route
        path={"/"}
        element={
          <PathSentinel>
            <DefaultLayout />
          </PathSentinel>
        }
      >
        <Route index={true} element={<MainPage />} />
      </Route>
      <Route element={<NotFoundPage />} path={"*"} />
    </Route>
  )
)

export default Router
