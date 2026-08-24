export function Spinner({ label = 'Loading...' }) {
  return (
    <div className="state-box">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return <div className="alert alert-error">{message}</div>;
}

export function EmptyState({ message }) {
  return <div className="state-box muted">{message}</div>;
}
