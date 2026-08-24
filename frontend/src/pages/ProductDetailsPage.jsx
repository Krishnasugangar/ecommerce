import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorBox, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { cartService, productService } from '../services';
import { formatCurrency, getErrorMessage } from '../utils/helpers';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    productService
      .get(id)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(getErrorMessage(err, 'Product not found')))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    setError('');
    setMessage('');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await cartService.addItem({ productId: Number(id), quantity: Number(quantity) });
      setMessage('Added to cart');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not add to cart'));
    }
  };

  if (loading) return <Spinner />;
  if (!product) return <ErrorBox message={error || 'Product not found'} />;

  return (
    <section className="product-details">
      <img
        src={product.imageUrl || 'https://placehold.co/800x600?text=Product'}
        alt={product.name}
      />
      <div>
        <p className="muted">{product.categoryName}</p>
        <h1>{product.name}</h1>
        <p className="price">{formatCurrency(product.price)}</p>
        <p>{product.description}</p>
        <p className="muted">In stock: {product.stockQuantity}</p>
        <ErrorBox message={error} />
        {message && <div className="alert alert-success">{message}</div>}
        <div className="inline-form">
          <input
            type="number"
            min="1"
            max={product.stockQuantity}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-primary"
            disabled={!product.active || product.stockQuantity < 1}
            onClick={addToCart}
          >
            Add to cart
          </button>
        </div>
      </div>
    </section>
  );
}
