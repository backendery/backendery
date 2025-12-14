import './Preloader.scss';

const Preloader: React.FC = () => (
  <div className="preloader">
    <div className="preloader__overlay">
      <p className="preloader__message">{'~/> loading...'}</p>
    </div>
  </div>
);

export default Preloader;
