import React, { FC } from "react"
import { Outlet } from "react-router-dom"

import ScreenSentinel from "../containers/ScreenSentinel/ScreenSentinel"
import { useBreakpoints } from "../hooks/useBreakpoints"

const DefaultLayout: FC = () => {
  // The useBreakpoints hook de-structurization
  const { isSmartphone, isSmallDevice, isTablet } = useBreakpoints()

  return (
    <React.Fragment>
      {(isSmartphone || isSmallDevice || isTablet) && <ScreenSentinel />}
      <Outlet />
    </React.Fragment>
  )
}

export default DefaultLayout
