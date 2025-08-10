import { AppProvider } from "./contexts/App"
import Router from "./pages/Router"

const App: React.FC<{ url?: string }> = ({ url }) => {
  return (
    <AppProvider><Router url={url} /></AppProvider>
  )
}

export default App
