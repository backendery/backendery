import { Outlet } from 'react-router-dom';

import ScreenSentinel from '~/containers/ScreenSentinel/ScreenSentinel';
import { useBreakpoints } from '~/hooks/useBreakpoints';

const DefaultLayout: React.FC = () => {
  // The useBreakpoints hook de-structurization
  const { isSmallDevice, isSmartphone, isTablet } = useBreakpoints();

  return (
    <>
      {(isSmartphone || isSmallDevice || isTablet) && <ScreenSentinel />}
      <Outlet />
    </>
  );
};

export default DefaultLayout;
