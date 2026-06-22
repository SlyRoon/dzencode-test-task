import { Outlet } from "react-router-dom";
import TopMenu from "./TopMenu/TopMenu";
import Sidebar from "./Sidebar/Sidebar";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout-wrapper">
      <TopMenu />
      <div className="layout-body">
        <Sidebar />
        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;