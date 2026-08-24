import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorBox, Spinner } from '../components/ui';
import { cartService } from '../services';
import { formatCurrency, getErrorMessage } from '../utils/helpers';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCart = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await cartService.get();
      setCart(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load cart'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await cartService.updateItem(itemId, { quantity: Number(quantity) });
      setCart(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update quantity'));
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await cartService.removeItem(itemId);
      setCart(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not remove item'));
    }
  };

  if (loading) return <Spinner />;

  return (
    <section>
      <div className="page-header">
        <h1>Your cart</h1>
        {cart?.items?.length > 0 && (
          <Link className="btn btn-primary" to="/checkout">
            Checkout
          </Link>
        )}
      </div>
      <ErrorBox message={error} />
      {!cart?.items?.length ? (
        <EmptyState message="Your cart is empty" />
      ) : (
        <div className="stack">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-row">
              <div>
                <h3>{item.productName}</h3>
                <p className="muted">{formatCurrency(item.unitPrice)} each</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, e.target.value)}
              />
              <strong>{formatCurrency(item.subtotal)}</strong>
              <button type="button" className="btn btn-ghost" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          ))}
          <div className="totals">
            <span>Total</span>
            <strong>{formatCurrency(cart.total)}</strong>
          </div>
        </div>
      )}
    </section>
  );
}
