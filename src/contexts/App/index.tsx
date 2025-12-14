import { type Options as ScrollbarsOptions } from 'overlayscrollbars';
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';
import useNetworkState from 'react-use/lib/useNetworkState';

/**
 * Application context properties interface.
 * @interface
 * @property {boolean} isOnline Indicates whether the user is currently online.
 * @property {ScrollbarsOptions} scrollbarsOptions Configuration options for OverlayScrollbars.
 */
type AppProps = {
  isOnline: boolean;
  scrollbarsOptions: ScrollbarsOptions;
};

/**
 * Application provider properties type with partial IAppProps. Allows overriding of specific
 * context properties.
 */
type AppProviderProps = PropsWithChildren<Partial<AppProps>>;

/**
 * Initial values for the application context properties. This object defines the default settings
 * for:
 *    - `isOnline`: Obserce the network connection status.
 *    - `scrollbarsOptions`: Configuration settings for OverlayScrollbars, defining its appearance,
 * behavior, and update options.
 */
const initialAppProps: AppProps = {
  // Default online status is set to false (offline)
  isOnline: false,
  // Configuration options for OverlayScrollbars
  scrollbarsOptions: {
    overflow: {
      x: 'hidden',
      y: 'scroll',
    },
    paddingAbsolute: true,
    scrollbars: {
      autoHide: 'move',
      autoHideDelay: 1_500,
      autoHideSuspend: false,
      clickScroll: false,
      dragScroll: true,
      pointers: ['mouse', 'touch', 'pen'],
      theme: 'os-theme-backendery',
      visibility: 'auto',
    },
    showNativeOverlaidScrollbars: false,
    update: {
      attributes: null,
      debounce: [0, 35],
      elementEvents: [['div', 'resize']],
      ignoreMutation: null,
    },
  },
};

/**
 * Create a React context for the application
 */
const AppContext = createContext<AppProps>(initialAppProps);

/**
 * Application provider component that manages the application's context.
 * @param {AppProviderProps} props Provider properties including optional overrides.
 * @returns {JSX.Element} The provider component wrapping the app context.
 */
const AppProvider: React.FC<AppProviderProps> = ({ children, ...restProps }) => {
  const { online } = useNetworkState();
  const [isOnline, setOnline] = useState<boolean>(online || false);

  useEffect(() => {
    setOnline(online || false);
  }, [online]);

  // Application context values combining default and override properties
  const appContextProps: AppProps = {
    isOnline,
    scrollbarsOptions: initialAppProps.scrollbarsOptions,
  };

  return (
    <AppContext.Provider
      value={{
        ...appContextProps,
        ...restProps,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook to access the application context.
 * @returns {AppProps} The current application context values.
 */
const useApp = () => useContext(AppContext);

export { AppProvider, useApp };
