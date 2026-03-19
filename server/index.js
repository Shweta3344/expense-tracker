const express = require('express');
const cors = require('cors');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

// Allow React app (different port) to call this API
app.use(cors());

// Parse JSON in request body
app.use(express.json());

// Test route - GET /
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running!' });
});

// DELETE - Remove expense
app.delete('/api/expenses/:id', (req, res) => {
    try {
      const { id } = req.params;
  
      const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  });
// PUT - Update expense
app.put('/api/expenses/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { amount, description, category, date } = req.body;
  
      const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      if (!amount || !description || !category || !date) {
        return res.status(400).json({ error: 'Amount, description, category, and date are required' });
      }
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
      }
  
      db.prepare(`
        UPDATE expenses 
        SET amount = ?, description = ?, category = ?, date = ?
        WHERE id = ?
      `).run(amount, description, category, date, id);
  
      const updated = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update expense' });
    }
  });

// GET - Summary (total + by category)
app.get('/api/expenses/summary', (req, res) => {
    try {
      const totalResult = db.prepare('SELECT SUM(amount) as total FROM expenses').get();
      const total = totalResult.total ?? 0;
  
      const categoryRows = db.prepare(`
        SELECT category, SUM(amount) as total 
        FROM expenses 
        GROUP BY category 
        ORDER BY total DESC
      `).all();
  
      res.json({
        total,
        byCategory: categoryRows
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch summary' });
    }
  });

app.post('/api/expenses', (req, res) => {
    try {
      const { amount, description, category, date } = req.body;
  
      // Validation
      if (!amount || !description || !category || !date) {
        return res.status(400).json({ error: 'Amount, description, category, and date are required' });
      }
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
      }
  
      const id = uuidv4();
      const createdAt = new Date().toISOString();
  
      db.prepare(`
        INSERT INTO expenses (id, amount, description, category, date, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, amount, description, category, date, createdAt);
  
      const newExpense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
      res.status(201).json(newExpense);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add expense' });
    }
  });
// GET all expenses
app.get('/api/expenses', (req, res) => {
    try {
      const expenses = db.prepare('SELECT * FROM expenses ORDER BY date DESC, createdAt DESC').all();
      res.json(expenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch expenses' });
    }
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});