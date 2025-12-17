import './Main.scss';

import AnimateLines from '~/components/AnimateLines/AnimateLines';

type MainProps = {
  readonly zoomOut: (event: React.MouseEvent) => void;
};

const Main: React.FC<MainProps> = ({ zoomOut }) => {
  return (
    <div className="main">
      <div className="main__brand-logo">
        <picture>
          <img alt="Backendery" loading="lazy" src="/assets/icons/brand-logo.svg" />
        </picture>
      </div>
      <div className="main__decorative-animate-lines-wrapper">
        <AnimateLines redrawInterval={6_500} />
      </div>
      <div className="main__title">Reliable backend for your projects</div>
      <div className="main__show-all" onClick={zoomOut}>
        {'~/show --all'}
      </div>
    </div>
  );
};

export default Main;
