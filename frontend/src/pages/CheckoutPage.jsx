import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBox, Spinner } from '../components/ui';
import { addressService, cartService, orderService } from '../services';
import { formatCurrency, getErrorMessage } from '../utils/helpers';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    defaultAddress: true,
  });

  useEffect(() => {
    Promise.all([cartService.get(), addressService.list()])
      .then(([cartRes, addressRes]) => {
        setCart(cartRes.data);
        setAddresses(addressRes.data);
        const defaultAddress = addressRes.data.find((a) => a.defaultAddress) || addressRes.data[0];
        if (defaultAddress) {
          setAddressId(String(defaultAddress.id));
        }
      })
      .catch((err) => setError(getErrorMessage(err, 'Failed to load checkout data')))
      .finally(() => setLoading(false));
  }, []);

  const createAddress = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const { data } = await addressService.create(form);
      setAddresses((prev) => [data, ...prev]);
      setAddressId(String(data.id));
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save address'));
    }
  };

  const placeOrder = async () => {
    if (!addressId) {
      setError('Select or create a shipping address');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { data } = await orderService.place({ addressId: Number(addressId) });
      navigate(`/orders/${data.id}`);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not place order'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <section className="checkout">
      <h1>Checkout</h1>
      <ErrorBox message={error} />
      <div className="grid-2">
        <div className="card">
          <h2>Shipping address</h2>
          {addresses.length > 0 ? (
            <div className="stack">
              {addresses.map((address) => (
                <label key={address.id} className="radio-card">
                  <input
                    type="radio"
                    name="address"
                    checked={addressId === String(address.id)}
                    onChange={() => setAddressId(String(address.id))}
                  />
                  <span>
                    <strong>{address.fullName}</strong>
                    <br />
                    {address.addressLine1}, {address.city}, {address.state} {address.postalCode}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <form className="form" onSubmit={createAddress}>
              <label>
                Full name
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </label>
              <label>
                Phone
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label>
                Address line 1
                <input
                  required
                  value={form.addressLine1}
                  onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                />
              </label>
              <label>
                City
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </label>
              <label>
                State
                <input
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </label>
              <label>
                Postal code
                <input
                  required
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                />
              </label>
              <label>
                Country
                <input
                  required
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </label>
              <button className="btn btn-primary" type="submit">
                Save address
              </button>
            </form>
          )}
        </div>
        <div className="card">
          <h2>Order summary</h2>
          {!cart?.items?.length ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.items.map((item) => (
                <div key={item.id} className="summary-row">
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <div className="totals">
                <span>Total</span>
                <strong>{formatCurrency(cart.total)}</strong>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                disabled={submitting || !cart.items.length}
                onClick={placeOrder}
              >
                {submitting ? 'Placing order...' : 'Place order'}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
