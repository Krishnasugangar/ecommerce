import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorBox, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import { getErrorMessage } from '../utils/helpers';

export default function ProfilePage() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    userService
      .me()
      .then((res) => {
        setProfile(res.data);
        setUser(res.data);
      })
      .catch((err) => setError(getErrorMessage(err, 'Failed to load profile')))
      .finally(() => setLoading(false));
  }, [setUser]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const { data } = await userService.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
      });
      setProfile(data);
      setUser(data);
      setMessage('Profile updated');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update profile'));
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await userService.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setMessage('Password updated');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not change password'));
    }
  };

  if (loading) return <Spinner />;
  if (!profile) return <ErrorBox message={error || 'Profile unavailable'} />;

  return (
    <section className="grid-2">
      <div className="card">
        <div className="page-header">
          <h1>Profile</h1>
          <Link to="/addresses">Manage addresses</Link>
        </div>
        <ErrorBox message={error} />
        {message && <div className="alert alert-success">{message}</div>}
        <form className="form" onSubmit={saveProfile}>
          <label>
            First name
            <input
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
          </label>
          <label>
            Last name
            <input
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
          </label>
          <label>
            Email
            <input value={profile.email} disabled />
          </label>
          <label>
            Phone
            <input
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Save profile
          </button>
        </form>
      </div>
      <div className="card">
        <h2>Change password</h2>
        <form className="form" onSubmit={changePassword}>
          <label>
            Current password
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
            />
          </label>
          <label>
            New password
            <input
              type="password"
              required
              minLength={8}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Update password
          </button>
        </form>
      </div>
    </section>
  );
}
