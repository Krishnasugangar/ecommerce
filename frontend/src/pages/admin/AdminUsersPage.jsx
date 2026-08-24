import { useEffect, useState } from 'react';
import { EmptyState, ErrorBox, Spinner } from '../../components/ui';
import { adminService } from '../../services';
import { getErrorMessage } from '../../utils/helpers';

export default function AdminUsersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .customers({ page: 0, size: 50 })
      .then((res) => setCustomers(res.data.content))
      .catch((err) => setError(getErrorMessage(err, 'Failed to load customers')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <section>
      <h1>Customers</h1>
      <ErrorBox message={error} />
      {!customers.length ? (
        <EmptyState message="No customers yet" />
      ) : (
        <div className="stack">
          {customers.map((customer) => (
            <div key={customer.id} className="list-card">
              <div>
                <strong>
                  {customer.firstName} {customer.lastName}
                </strong>
                <p className="muted">{customer.email}</p>
              </div>
              <span className="badge">{customer.enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
