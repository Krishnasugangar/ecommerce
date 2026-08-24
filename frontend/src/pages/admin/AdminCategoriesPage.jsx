import { useEffect, useState } from 'react';
import { EmptyState, ErrorBox, Spinner } from '../../components/ui';
import { categoryService } from '../../services';
import { getErrorMessage } from '../../utils/helpers';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await categoryService.list();
      setCategories(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load categories'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await categoryService.create(form);
      setForm({ name: '', description: '' });
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create category'));
    }
  };

  const remove = async (id) => {
    try {
      await categoryService.remove(id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete category'));
    }
  };

  if (loading) return <Spinner />;

  return (
    <section className="grid-2">
      <div className="card">
        <h1>Categories</h1>
        <ErrorBox message={error} />
        {!categories.length ? (
          <EmptyState message="No categories" />
        ) : (
          <div className="stack">
            {categories.map((category) => (
              <div key={category.id} className="list-card">
                <div>
                  <strong>{category.name}</strong>
                  <p className="muted">{category.description}</p>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => remove(category.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="card">
        <h2>Add category</h2>
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
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Create
          </button>
        </form>
      </div>
    </section>
  );
}
