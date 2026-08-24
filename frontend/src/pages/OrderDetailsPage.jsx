import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorBox, Spinner } from '../components/ui';
import { orderService } from '../services';
import { formatCurrency, getErrorMessage } from '../utils/helpers';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await orderService.get(id);
      setOrder(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Order not found'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const cancel = async () => {
    setError('');
    setMessage('');
    try {
      const { data } = await orderService.cancel(id);
      setOrder(data);
      setMessage('Order cancelled');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not cancel order'));
    }
  };

  if (loading) return <Spinner />;
  if (!order) return <ErrorBox message={error || 'Order not found'} />;

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h1>Order #{order.id}</h1>
          <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="right">
          <span className="badge">{order.status}</span>
          <span className="badge">{order.paymentStatus}</span>
        </div>
      </div>
      <ErrorBox message={error} />
      {message && <div className="alert alert-success">{message}</div>}
      <h2>Items</h2>
      {order.items.map((item) => (
        <div key={item.id} className="summary-row">
          <span>
            {item.productName} × {item.quantity}
          </span>
          <span>{formatCurrency(item.subtotal)}</span>
        </div>
      ))}
      <div className="totals">
        <span>Total</span>
        <strong>{formatCurrency(order.totalAmount)}</strong>
      </div>
      <h2>Shipping</h2>
      <p>
        {order.shippingAddress.fullName}
        <br />
        {order.shippingAddress.addressLine1}
        <br />
        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
        {order.shippingAddress.postalCode}
        <br />
        {order.shippingAddress.country}
      </p>
      {['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status) && (
        <button type="button" className="btn btn-ghost" onClick={cancel}>
          Cancel order
        </button>
      )}
    </section>
  );
}
