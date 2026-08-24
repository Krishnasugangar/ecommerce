import { useEffect, useState } from 'react';
import { EmptyState, ErrorBox, Spinner } from '../components/ui';
import { addressService } from '../services';
import { getErrorMessage } from '../utils/helpers';

const emptyForm = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  defaultAddress: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await addressService.list();
      setAddresses(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load addresses'));
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
      await addressService.create(form);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save address'));
    }
  };

  const setDefault = async (id) => {
    await addressService.setDefault(id);
    await load();
  };

  const remove = async (id) => {
    await addressService.remove(id);
    await load();
  };

  if (loading) return <Spinner />;

  return (
    <section className="grid-2">
      <div className="card">
        <h1>Addresses</h1>
        <ErrorBox message={error} />
        {!addresses.length ? (
          <EmptyState message="No saved addresses" />
        ) : (
          <div className="stack">
            {addresses.map((address) => (
              <div key={address.id} className="list-card">
                <div>
                  <strong>{address.fullName}</strong>
                  {address.defaultAddress && <span className="badge">Default</span>}
                  <p className="muted">
                    {address.addressLine1}, {address.city}, {address.state} {address.postalCode}
                  </p>
                </div>
                <div className="inline-form">
                  {!address.defaultAddress && (
                    <button type="button" className="btn btn-ghost" onClick={() => setDefault(address.id)}>
                      Make default
                    </button>
                  )}
                  <button type="button" className="btn btn-ghost" onClick={() => remove(address.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="card">
        <h2>Add address</h2>
        <form className="form" onSubmit={onSubmit}>
          {Object.keys(emptyForm)
            .filter((key) => key !== 'defaultAddress' && key !== 'addressLine2')
            .map((key) => (
              <label key={key}>
                {key}
                <input
                  required={key !== 'addressLine2'}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}
          <label>
            addressLine2
            <input
              value={form.addressLine2}
              onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.defaultAddress}
              onChange={(e) => setForm({ ...form, defaultAddress: e.target.checked })}
            />
            Set as default
          </label>
          <button className="btn btn-primary" type="submit">
            Save address
          </button>
        </form>
      </div>
    </section>
  );
}
