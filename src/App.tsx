import { AppProvider } from '~/contexts/App';
import { useGTM } from '~/hooks/useGTM';
import Router from '~/pages/Router';

const App: React.FC<{ url?: string }> = ({ url }) => {
  useGTM(import.meta.env.VITE_GTM_ID);

  return (
    <AppProvider>
      <Router url={url ?? ''} />
    </AppProvider>
  );
};

export default App;
