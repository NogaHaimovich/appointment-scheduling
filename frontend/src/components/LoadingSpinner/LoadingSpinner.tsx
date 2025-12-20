import "./styles.scss";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="loading-spinner__spinner"></div>
      <p className="loading-spinner__text">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;

