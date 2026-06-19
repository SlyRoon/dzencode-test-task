import { NavLink } from "react-router-dom"

function Sidebar() {
    return (
        <div>
            <NavLink to={'/orders'}>OrderPage </NavLink>
            <NavLink to={'/products'}>ProductsPage</NavLink>
        </div>
    )
}
export default Sidebar
