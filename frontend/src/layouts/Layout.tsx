import { Outlet } from "react-router-dom";
import TopMenu from "./TopMenu";
import Sidebar from "./Sidebar";
function Layout() {
  return (
    <div className="layout-wrapper">
      <TopMenu />
      <div className="layout-body">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
export default Layout;
