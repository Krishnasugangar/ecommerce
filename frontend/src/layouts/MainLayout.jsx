import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          ShopHub
        </Link>
        <nav className="nav">
          <NavLink to="/products">Products</NavLink>
          {isAuthenticated && <NavLink to="/cart">Cart</NavLink>}
          {isAuthenticated && <NavLink to="/orders">Orders</NavLink>}
          {isAuthenticated && <NavLink to="/profile">Profile</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="auth-actions">
          {isAuthenticated ? (
            <>
              <span className="muted">Hi, {user?.firstName}</span>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <footer className="footer">Portfolio e-commerce demo · Spring Boot + React</footer>
    </div>
  );
}
