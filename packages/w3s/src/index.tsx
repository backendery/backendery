import { createRoot, hydrateRoot } from "react-dom/client"

import App from "./App"

import "./index.scss"

const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
if (isBrowser) {
  const rootElement = document.querySelector("#root") as HTMLDivElement
  import.meta.env.DEV ? createRoot(rootElement).render(<App />) : hydrateRoot(rootElement, <App />);
}

const prerender = async (data: any) => {
  const { renderToString } = await import('react-dom/server');
  const { parseLinks } = await import('vite-prerender-plugin/parse');

  const html = await renderToString(<App {...data} />);
  const links = parseLinks(html);

  return { html, links };
};

export { prerender }
