import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getSummary } from '../api';

const COLORS = ['#0d9488', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

function Dashboard() {
  const [summary, setSummary] = useState({ total: 0, byCategory: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSummary()
      .then((res) => setSummary(res.data))
      .catch((err) => setError(err.message || 'Failed to load summary'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = summary.byCategory.map((item) => ({
    name: item.category,
    value: item.total
  }));

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
      <h2 className="page-title">Dashboard</h2>
      <p className="page-subtitle">Overview of your expenses</p>

      <div className="dashboard-cards">
        <div className="card card-total">
          <div className="card-total-icon">₹</div>
          <h3 className="card-label">Total Spent</h3>
          <p className="card-value">₹{summary.total}</p>
        </div>
        {summary.byCategory.map((item, i) => (
          <div key={item.category} className="card card-category">
            <span className="card-category-dot" style={{ background: COLORS[i % COLORS.length] }} />
            <h3 className="card-label">{item.category}</h3>
            <p className="card-value card-value-sm">₹{item.total}</p>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="chart-container card">
          <h3 className="chart-title">Spending by Category</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="dashboard-actions">
        <Link to="/add" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
          + Add Expense
        </Link>
        <Link to="/expenses" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
          View All Expenses
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
