function BrandLogo({ compact = false }) {
  return (
    <div className={`brand-lockup ${compact ? "compact" : ""}`}>
      <div className="brand-mark" aria-hidden="true">
        <img src="/cinevault-mark.svg" alt="" />
      </div>
      {!compact ? (
        <div className="brand-copy">
          <h1>MovieVault</h1>
          <p>Your Personal Entertainment Archive</p>
        </div>
      ) : null}
    </div>
  );
}

export default BrandLogo;
