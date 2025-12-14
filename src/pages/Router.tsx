import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import InternalServerError from '~/containers/errors/InternalServerError/InternalServerError';
import DefaultLayout from '~/layouts/DefaultLayout';

import MainPage from './MainPage';
import NotFoundPage from './NotFoundPage';

const PathSentinel = ({ children }: { readonly children: React.ReactNode }) => {
  const location = useLocation();

  // Allowed keys from GTM
  const allowedGtmParameters = ['gtm_debug', 'gtm_preview', 'id'];

  const currentPath = location.pathname;
  const searchParameters = new URLSearchParams(location.search);

  const hasSearchParameters = searchParameters.toString() !== '';
  const isFromGtm = Array.from(searchParameters.keys()).some((key) => allowedGtmParameters.includes(key));

  if (currentPath !== '/' || (hasSearchParameters && !isFromGtm)) {
    return <NotFoundPage />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        element={
          <PathSentinel>
            <DefaultLayout />
          </PathSentinel>
        }
        errorElement={
          <InternalServerError
            error={undefined}
            resetErrorBoundary={() => {
              document.location.reload();
            }}
          />
        }
        path="/"
      >
        <Route element={<MainPage />} index />
      </Route>
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
};

const Router = ({ url }: { readonly url?: string }) => {
  return (
    <BrowserRouter basename={url ?? '/'}>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default Router;
