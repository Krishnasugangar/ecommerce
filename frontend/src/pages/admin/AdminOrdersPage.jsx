import { useEffect, useState } from 'react';
import { EmptyState, ErrorBox, Spinner } from '../../components/ui';
import { adminService } from '../../services';
import { formatCurrency, getErrorMessage } from '../../utils/helpers';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.orders({ page: 0, size: 50, sort: 'createdAt,desc' });
      setOrders(data.content);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load orders'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateOrderStatus(id, { status });
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update status'));
    }
  };

  if (loading) return <Spinner />;

  return (
    <section>
      <h1>Orders</h1>
      <ErrorBox message={error} />
      {!orders.length ? (
        <EmptyState message="No orders" />
      ) : (
        <div className="stack">
          {orders.map((order) => (
            <div key={order.id} className="list-card">
              <div>
                <strong>#{order.id}</strong> · {order.customerEmail}
                <p className="muted">
                  {formatCurrency(order.totalAmount)} · {order.paymentStatus}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
