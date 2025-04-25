import { StrictMode } from "react"

import { createRoot } from "react-dom/client"

import App from "./App"

import "./index.scss"

const rootElement = document.querySelector("#root") as HTMLDivElement
const root = createRoot(rootElement)

root.render(
  /* prettier-ignore */
  import.meta.env.DEV ? (<StrictMode><App /></StrictMode>) : (<App />)
)
