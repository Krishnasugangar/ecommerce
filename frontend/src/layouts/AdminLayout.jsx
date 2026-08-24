import { Link, NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="brand">
          Admin
        </Link>
        <NavLink to="/admin">Dashboard</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/categories">Categories</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <NavLink to="/admin/users">Customers</NavLink>
        <Link to="/">← Storefront</Link>
      </aside>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
