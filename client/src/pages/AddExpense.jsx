import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addExpense } from '../api';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Other'];

function AddExpense() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? value : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(formData.amount);
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!amount || amount <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    setLoading(true);
    try {
      await addExpense({
        amount,
        description: formData.description.trim(),
        category: formData.category,
        date: formData.date
      });
      navigate('/expenses');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Add Expense</h2>
      <p className="page-subtitle">Record a new expense</p>

      <div className="card form-card">
        <form onSubmit={handleSubmit} className="expense-form">
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              placeholder="0.00"
              required
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Lunch at cafe"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/expenses')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
