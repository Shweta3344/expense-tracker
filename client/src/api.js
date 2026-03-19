import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.message === 'Network Error') {
      err.message = 'Cannot connect to server. Is the backend running?';
    }
    return Promise.reject(err);
  }
);

export const getExpenses = () => api.get('/expenses');
export const getSummary = () => api.get('/expenses/summary');
export const addExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export default api;