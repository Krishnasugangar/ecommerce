import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { EmptyState, ErrorBox, Spinner } from '../components/ui';
import { categoryService, productService } from '../services';
import { getErrorMessage } from '../utils/helpers';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    sort: 'createdAt,desc',
  });

  useEffect(() => {
    categoryService.list().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [sortField, sortDir] = filters.sort.split(',');
        const { data } = await productService.list({
          search: filters.search || undefined,
          categoryId: filters.categoryId || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          page,
          size: 8,
          sort: `${sortField},${sortDir}`,
        });
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load products'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters, page]);

  return (
    <section>
      <div className="page-header">
        <h1>Products</h1>
      </div>

      <div className="filters">
        <input
          placeholder="Search products"
          value={filters.search}
          onChange={(e) => {
            setPage(0);
            setFilters({ ...filters, search: e.target.value });
          }}
        />
        <select
          value={filters.categoryId}
          onChange={(e) => {
            setPage(0);
            setFilters({ ...filters, categoryId: e.target.value });
          }}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={(e) => {
            setPage(0);
            setFilters({ ...filters, minPrice: e.target.value });
          }}
        />
        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(e) => {
            setPage(0);
            setFilters({ ...filters, maxPrice: e.target.value });
          }}
        />
        <select
          value={filters.sort}
          onChange={(e) => {
            setPage(0);
            setFilters({ ...filters, sort: e.target.value });
          }}
        >
          <option value="createdAt,desc">Newest</option>
          <option value="price,asc">Price: Low to High</option>
          <option value="price,desc">Price: High to Low</option>
          <option value="name,asc">Name A-Z</option>
        </select>
      </div>

      <ErrorBox message={error} />
      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <EmptyState message="No products found" />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pager">
          <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
