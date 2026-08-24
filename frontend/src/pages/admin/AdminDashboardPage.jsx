import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorBox, Spinner } from '../../components/ui';
import { adminService } from '../../services';
import { formatCurrency, getErrorMessage } from '../../utils/helpers';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .dashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err, 'Failed to load dashboard')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <ErrorBox message={error || 'No dashboard data'} />;

  return (
    <section>
      <h1>Admin dashboard</h1>
      <ErrorBox message={error} />
      <div className="stats-grid">
        <div className="stat-card"><span>Users</span><strong>{data.totalUsers}</strong></div>
        <div className="stat-card"><span>Customers</span><strong>{data.totalCustomers}</strong></div>
        <div className="stat-card"><span>Products</span><strong>{data.totalProducts}</strong></div>
        <div className="stat-card"><span>Active products</span><strong>{data.activeProducts}</strong></div>
        <div className="stat-card"><span>Orders</span><strong>{data.totalOrders}</strong></div>
        <div className="stat-card"><span>Pending orders</span><strong>{data.pendingOrders}</strong></div>
        <div className="stat-card"><span>Total sales</span><strong>{formatCurrency(data.totalSales)}</strong></div>
      </div>
      <h2>Recent orders</h2>
      <div className="stack">
        {data.recentOrders.map((order) => (
          <Link key={order.id} to={`/admin/orders`} className="list-card">
            <div>
              <strong>#{order.id}</strong> · {order.customerEmail}
            </div>
            <div className="right">
              <span className="badge">{order.status}</span>
              <strong>{formatCurrency(order.totalAmount)}</strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
