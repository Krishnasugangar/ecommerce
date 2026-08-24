import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorBox, Spinner } from '../../components/ui';
import { categoryService, productService } from '../../services';
import { getErrorMessage } from '../../utils/helpers';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  imageUrl: '',
  categoryId: '',
  active: true,
};

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.list().then((res) => setCategories(res.data));
    if (isEdit) {
      productService
        .get(id)
        .then((res) => {
          const product = res.data;
          setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            imageUrl: product.imageUrl || '',
            categoryId: product.categoryId,
            active: product.active,
          });
        })
        .catch((err) => setError(getErrorMessage(err, 'Failed to load product')))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      categoryId: Number(form.categoryId),
    };
    try {
      if (isEdit) {
        await productService.update(id, payload);
      } else {
        await productService.create(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save product'));
    }
  };

  if (loading) return <Spinner />;

  return (
    <section className="card">
      <h1>{isEdit ? 'Edit product' : 'Create product'}</h1>
      <ErrorBox message={error} />
      <form className="form" onSubmit={onSubmit}>
        <label>
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <div className="grid-2">
          <label>
            Price
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              required
              value={form.stockQuantity}
              onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
            />
          </label>
        </div>
        <label>
          Category
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Image URL
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active
        </label>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </form>
    </section>
  );
}
