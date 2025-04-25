import { Partytown } from "@qwik.dev/partytown/react"
import { useEffect, useState } from "react"
import { RouterProvider } from "react-router-dom"

import Preloader from "./containers/Preloader/Preloader"
import { AppProvider } from "./contexts/App"
import Router from "./pages/Router"

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const handleReady = () => {
      setIsLoading(false)
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
      handleReady()
    } else {
      window.addEventListener("DOMContentLoaded", handleReady, { once: true })
    }

    return () => {
      window.removeEventListener("DOMContentLoaded", handleReady)
    }
  }, [])

  return (
    <AppProvider>
      <Partytown debug={import.meta.env.DEV} forward={["dataLayer.push"]} />
      {isLoading ? <Preloader /> : <RouterProvider router={Router} />}
    </AppProvider>
  )
}

export default App
