import { NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { navigationGroups } from "../data/navigation";

function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <BrandLogo />
        </div>

        {navigationGroups.map((group) => (
          <div className="nav-group" key={group.title}>
            <span className="nav-title">{group.title}</span>
            <nav>
              {group.items.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={onClose}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </aside>
      <button className={`sidebar-overlay ${open ? "show" : ""}`} onClick={onClose} aria-label="Close menu" />
    </>
  );
}

export default Sidebar;
