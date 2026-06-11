import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({ children, title, subtitle, query, onQueryChange, user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="main-shell">
        <Topbar
          title={title}
          subtitle={subtitle}
          query={query}
          onQueryChange={onQueryChange}
          onToggleMenu={() => setOpen(true)}
          user={user}
          onLogout={onLogout}
        />
        {children}
      </main>
    </div>
  );
}

export default Layout;
