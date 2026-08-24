import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl || 'https://placehold.co/600x400?text=Product'}
          alt={product.name}
        />
        <div className="product-card-body">
          <h3>{product.name}</h3>
          <p className="muted">{product.categoryName}</p>
          <strong>{formatCurrency(product.price)}</strong>
        </div>
      </Link>
    </article>
  );
}
