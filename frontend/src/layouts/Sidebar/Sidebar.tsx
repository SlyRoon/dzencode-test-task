import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Sidebar.css";
import userAvatar from "../../assets/smile_face.jpeg";

const NAV_ITEMS = [
  { to: "/income", key: "nav.income" },
  { to: "/groups", key: "nav.groups" },
  { to: "/users", key: "nav.users" },
  { to: "/settings", key: "nav.settings" },
];

function Sidebar() {
  const { t } = useTranslation();

  return (
    <div className="left-sidebar">
      <NavLink
        to="/settings"
        className="left-sidebar__avatar-wrap"
        aria-label={t("nav.settings")}
        title={t("nav.settings")}
      >
        <img src={userAvatar} alt="User" className="left-sidebar__avatar" />
        <span className="left-sidebar__gear" aria-hidden="true">⚙</span>
      </NavLink>

      <nav className="left-sidebar__navigate d-flex gap-3 flex-column">
        {NAV_ITEMS.map(({ to, key }) => (
          <NavLink key={to} className="left-sidebar__link" to={to}>
            {t(key)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
