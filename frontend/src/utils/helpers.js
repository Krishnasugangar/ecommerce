export function getErrorMessage(error, fallback = 'Something went wrong') {
  const data = error?.response?.data;
  if (!data) {
    return fallback;
  }
  if (data.errors && typeof data.errors === 'object') {
    return Object.values(data.errors).join(', ');
  }
  return data.message || fallback;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount || 0));
}
