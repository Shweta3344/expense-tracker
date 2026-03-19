const Database = require('better-sqlite3');
const path = require('path');

// Create/connect to database file in server folder
const dbPath = path.join(__dirname, 'expenses.db');
const db = new Database(dbPath);

// Create expenses table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

module.exports = db;