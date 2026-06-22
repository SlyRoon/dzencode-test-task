import { NavLink } from "react-router-dom";
import './Sidebar.css'
import userAvatar from "../../assets/smile_face.jpeg";
function Sidebar() {
  return (
    <div className="left-sidebar">
      <div className="left-sidebar__avatar-wrap">
        <img src={userAvatar} alt="User" className="left-sidebar__avatar" />
        <button className="left-sidebar__gear">⚙</button>
      </div>

      <div className="left-sidebar__navigate d-flex gap-3 flex-column">
        <NavLink className="left-sidebar__link" to="/orders">
          ПРИХОД
        </NavLink>
        <NavLink className="left-sidebar__link" to="/groups">
          ГРУППЫ
        </NavLink>
        <NavLink className="left-sidebar__link" to="/products">
          ПРОДУКТЫ
        </NavLink>
        <NavLink className="left-sidebar__link" to="/users">
          ПОЛЬЗОВАТЕЛИ
        </NavLink>
        <NavLink className="left-sidebar__link" to="/settings">
          НАСТРОЙКИ
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
