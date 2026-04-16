import api from './api';

export const getProducts = async (search = '', category = '') => {
  let query = '';
  if (search || category) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category); // Pass category name
    query = `?${params.toString()}`;
  }
  const response = await api.get(`/products${query}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;
};
