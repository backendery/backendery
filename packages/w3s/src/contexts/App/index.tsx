import { Options as ScrollbarsOptions } from "overlayscrollbars"
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react"
import { useNetworkState } from "react-use"

/**
 * Application context properties interface.
 *
 * @interface
 * @property {boolean} isOnline Indicates whether the user is currently online.
 * @property {ScrollbarsOptions} scrollbarsOptions Configuration options for OverlayScrollbars.
 */
interface IAppProps {
  isOnline: boolean
  scrollbarsOptions: ScrollbarsOptions
}

/**
 * Application provider properties type with partial IAppProps. Allows overriding of specific
 * context properties.
 */
type AppProviderProps = PropsWithChildren<Partial<IAppProps>>

/**
 * Initial values for the application context properties. This object defines the default settings
 * for:
 *    - `isOnline`: Obserce the network connection status.
 *    - `scrollbarsOptions`: Configuration settings for OverlayScrollbars, defining its appearance,
 * behavior, and update options.
 */
const initialAppProps: IAppProps = {
  // Default online status is set to false (offline)
  isOnline: false,
  // Configuration options for OverlayScrollbars
  scrollbarsOptions: {
    paddingAbsolute: true,
    showNativeOverlaidScrollbars: false,
    update: {
      elementEvents: [["div", "resize"]],
      debounce: [0, 35],
      attributes: null,
      ignoreMutation: null,
    },
    overflow: {
      x: "hidden",
      y: "scroll",
    },
    scrollbars: {
      theme: "os-theme-backendery",
      visibility: "auto",
      autoHide: "move",
      autoHideDelay: 1_500,
      autoHideSuspend: false,
      dragScroll: true,
      clickScroll: false,
      pointers: ["mouse", "touch", "pen"],
    },
  },
}

/**
 * Create a React context for the application
 */
const AppContext = createContext<IAppProps>(initialAppProps)

/**
 * Application provider component that manages the application's context.
 *
 * @param {AppProviderProps} props Provider properties including optional overrides.
 * @returns {JSX.Element} The provider component wrapping the app context.
 */
const AppProvider: FC<AppProviderProps> = ({ children, ...props }) => {
  const { online } = useNetworkState()
  const [isOnline, setOnline] = useState<boolean>(online || false)

  useEffect(() => {
    setOnline(online || false)
  }, [online])

  // Application context values combining default and override properties
  const appContextProps: IAppProps = {
    isOnline,
    scrollbarsOptions: initialAppProps.scrollbarsOptions,
  }

  return (
    <AppContext.Provider
      value={{
        ...appContextProps,
        ...props,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

/**
 * Custom hook to access the application context.
 *
 * @returns {IAppProps} The current application context values.
 */
const useApp = () => useContext(AppContext)

export { AppProvider, useApp }
