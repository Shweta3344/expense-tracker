import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses, deleteExpense } from '../api';

const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Other'];

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchExpenses = () => {
    getExpenses()
      .then((res) => {
        setExpenses(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch expenses');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((exp) => {
    const matchCategory = categoryFilter === 'All' || exp.category === categoryFilter;
    const matchFrom = !dateFrom || exp.date >= dateFrom;
    const matchTo = !dateTo || exp.date <= dateTo;
    return matchCategory && matchFrom && matchTo;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return <div className="error-msg">Error: {error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Expense List</h2>
          <p className="page-subtitle">Manage and filter your expenses</p>
        </div>
        <Link to="/add" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px' }}>
          + Add Expense
        </Link>
      </div>

      <div className="card filters-bar">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="filter-input"
            />
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => { setCategoryFilter('All'); setDateFrom(''); setDateTo(''); }}
            style={{ alignSelf: 'flex-end' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty-state card">
          <p>No expenses match your filters.</p>
          <Link to="/add" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 24px' }}>Add one</Link>
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-wrapper">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th className="text-right">Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp, i) => (
                  <tr key={exp.id} className={i % 2 === 1 ? 'striped' : ''}>
                    <td>{exp.date}</td>
                    <td className="desc-cell">{exp.description}</td>
                    <td>
                      <span className="category-badge">{exp.category}</span>
                    </td>
                    <td className="amount-cell">₹{exp.amount}</td>
                    <td className="actions-cell">
                      <Link to={`/expenses/edit/${exp.id}`} className="action-link">Edit</Link>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => handleDelete(exp.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
