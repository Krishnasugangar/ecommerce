import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Full-stack portfolio project</p>
        <h1>Modern e-commerce built with Spring Boot and React</h1>
        <p className="lede">
          Browse products, manage your cart, place orders, and explore an admin dashboard with
          real JWT security and transactional order handling.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/products">
            Browse products
          </Link>
          {!isAuthenticated && (
            <Link className="btn btn-ghost" to="/register">
              Create account
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
