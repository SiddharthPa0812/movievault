import { Clapperboard, LogOut, Menu, Search } from "lucide-react";

function Topbar({ query, onQueryChange, onToggleMenu, title, subtitle, user, onLogout }) {
  return (
    <header className="topbar glass-card">
      <div className="topbar-copy">
        <button className="icon-button mobile-menu" onClick={onToggleMenu} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="topbar-brand">
          <span className="topbar-brand-icon">
            <Clapperboard size={16} />
          </span>
          <span>MovieVault</span>
        </div>
        <p className="eyebrow">{subtitle}</p>
        <h2>{title}</h2>
      </div>
      <div className="topbar-actions">
        <label className="search-shell">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search your archive..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>
        {user ? (
          <div className="user-chip">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="user-avatar" />
            ) : (
              <span className="user-fallback">{user.name?.slice(0, 1) || "M"}</span>
            )}
            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
            <button type="button" className="icon-button" onClick={onLogout} aria-label="Logout">
              <LogOut size={16} />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Topbar;
