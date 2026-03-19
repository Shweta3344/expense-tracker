import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExpenses, updateExpense } from '../api';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Other'];

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ amount: '', description: '', category: 'Food', date: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    getExpenses().then((res) => {
      const exp = res.data.find((e) => e.id === id);
      if (exp) {
        setFormData({
          amount: String(exp.amount),
          description: exp.description,
          category: exp.category,
          date: exp.date
        });
      }
      setPageLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      await updateExpense(id, {
        amount,
        description: formData.description.trim(),
        category: formData.category,
        date: formData.date
      });
      navigate('/expenses');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Edit Expense</h2>
      <p className="page-subtitle">Update expense details</p>

      <div className="card form-card">
        <form onSubmit={handleSubmit} className="expense-form">
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label>Amount *</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} step="0.01" min="0.01" required />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/expenses')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpense;
