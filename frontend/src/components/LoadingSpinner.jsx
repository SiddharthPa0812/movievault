function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="loading-shell">
      <div className="loader" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
