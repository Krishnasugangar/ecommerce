import api from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
};

export const productService = {
  list: (params) => api.get('/products', { params }),
  search: (q, params) => api.get('/products/search', { params: { q, ...params } }),
  byCategory: (categoryId, params) => api.get(`/products/category/${categoryId}`, { params }),
  get: (id) => api.get(`/products/${id}`),
  create: (payload) => api.post('/products', payload),
  update: (id, payload) => api.put(`/products/${id}`, payload),
  remove: (id) => api.delete(`/products/${id}`),
};

export const categoryService = {
  list: () => api.get('/categories'),
  create: (payload) => api.post('/categories', payload),
  update: (id, payload) => api.put(`/categories/${id}`, payload),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const cartService = {
  get: () => api.get('/cart'),
  addItem: (payload) => api.post('/cart/items', payload),
  updateItem: (itemId, payload) => api.put(`/cart/items/${itemId}`, payload),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
};

export const orderService = {
  place: (payload) => api.post('/orders', payload),
  list: (params) => api.get('/orders', { params }),
  get: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
};

export const addressService = {
  list: () => api.get('/addresses'),
  create: (payload) => api.post('/addresses', payload),
  update: (id, payload) => api.put(`/addresses/${id}`, payload),
  remove: (id) => api.delete(`/addresses/${id}`),
  setDefault: (id) => api.put(`/addresses/${id}/default`),
};

export const userService = {
  me: () => api.get('/users/me'),
  updateProfile: (payload) => api.put('/users/me', payload),
  changePassword: (payload) => api.put('/users/me/password', payload),
};

export const adminService = {
  dashboard: () => api.get('/admin/dashboard'),
  orders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, payload) => api.put(`/admin/orders/${id}/status`, payload),
  customers: (params) => api.get('/admin/customers', { params }),
  updateInventory: (id, payload) => api.put(`/admin/products/${id}/inventory`, payload),
};
