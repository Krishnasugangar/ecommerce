import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorBox, Spinner } from '../../components/ui';
import { adminService, productService } from '../../services';
import { formatCurrency, getErrorMessage } from '../../utils/helpers';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = () =>
    Promise.all([
      productService.list({ page: 0, size: 50, sort: 'id,desc', active: true }),
      productService.list({ page: 0, size: 50, sort: 'id,desc', active: false }),
    ]).then(([activeRes, inactiveRes]) => {
      setProducts([...activeRes.data.content, ...inactiveRes.data.content]);
    });

  useEffect(() => {
    refresh()
      .catch((err) => setError(getErrorMessage(err, 'Failed to load products')))
      .finally(() => setLoading(false));
  }, []);

  const deactivate = async (id) => {
    await productService.remove(id);
    await refresh();
  };

  const updateStock = async (id, stockQuantity) => {
    await adminService.updateInventory(id, { stockQuantity: Number(stockQuantity) });
  };

  if (loading) return <Spinner />;

  return (
    <section>
      <div className="page-header">
        <h1>Products</h1>
        <Link className="btn btn-primary" to="/admin/products/new">
          Add product
        </Link>
      </div>
      <ErrorBox message={error} />
      {!products.length ? (
        <EmptyState message="No products" />
      ) : (
        <div className="stack">
          {products.map((product) => (
            <div key={product.id} className="list-card">
              <div>
                <strong>{product.name}</strong>
                <p className="muted">
                  {formatCurrency(product.price)} · stock {product.stockQuantity} ·{' '}
                  {product.active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="inline-form">
                <input
                  type="number"
                  min="0"
                  defaultValue={product.stockQuantity}
                  onBlur={(e) => updateStock(product.id, e.target.value)}
                />
                <Link className="btn btn-ghost" to={`/admin/products/${product.id}`}>
                  Edit
                </Link>
                {product.active && (
                  <button type="button" className="btn btn-ghost" onClick={() => deactivate(product.id)}>
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
