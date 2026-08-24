import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorBox, Spinner } from '../components/ui';
import { orderService } from '../services';
import { formatCurrency, getErrorMessage } from '../utils/helpers';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderService
      .list({ page: 0, size: 20 })
      .then((res) => setOrders(res.data.content))
      .catch((err) => setError(getErrorMessage(err, 'Failed to load orders')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <section>
      <h1>Order history</h1>
      <ErrorBox message={error} />
      {!orders.length ? (
        <EmptyState message="No orders yet" />
      ) : (
        <div className="stack">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="list-card">
              <div>
                <strong>Order #{order.id}</strong>
                <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="right">
                <span className="badge">{order.status}</span>
                <strong>{formatCurrency(order.totalAmount)}</strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
