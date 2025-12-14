import './InternalServerError.scss';

import { type FallbackProps } from 'react-error-boundary';

import AnimateSignalStrip from '~/components/AnimateSignalStrip/AnimateSignalStrip';
import SvgIcon from '~/components/elements/Icon';

const InternalServerError: React.FC<FallbackProps> = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="internal-server-error">
      <div className="internal-server-error__wrapper">
        <div className="internal-server-error__status-code">5XX</div>
        <div className="internal-server-error__message">
          Uh-oh! <br /> Server failure :/
        </div>
        <div
          className="internal-server-error__reload"
          onClick={(_: React.MouseEvent) => {
            resetErrorBoundary();
          }}
        >
          Reload
          <SvgIcon name="arrow-turn" />
        </div>
      </div>
      <div className="internal-server-error__decorative-animate-signal-strip-wrapper">
        <AnimateSignalStrip
          initialSymbols=".."
          maxInterval={2_500}
          maxNumberOfSymbols={4}
          minInterval={1_000}
          style={{ color: '#f1f7f7' }}
          symbol="."
        />
        <AnimateSignalStrip
          initialSymbols="....."
          maxInterval={2_500}
          maxNumberOfSymbols={7}
          minInterval={1_250}
          style={{ color: '#00df82' }}
          symbol="."
        />
      </div>
    </div>
  );
};

export default InternalServerError;
