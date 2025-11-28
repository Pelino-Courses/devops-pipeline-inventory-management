const { Pool } = require('pg');

// Use PostgreSQL in production, SQLite for development
const isProduction = process.env.NODE_ENV === 'production';

let db;

if (isProduction && process.env.DATABASE_URL) {
  // PostgreSQL for production
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Test connection
  pool.query('SELECT NOW()', (err) => {
    if (err) {
      console.error('PostgreSQL connection error:', err);
    } else {
      console.log('Connected to PostgreSQL database');
    }
  });

  // Create table if not exists
  pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      cost REAL DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Items table ready');
    }
  });

  db = {
    all: (query, params, callback) => {
      pool.query(query, params, (err, result) => {
        callback(err, result ? result.rows : null);
      });
    },
    get: (query, params, callback) => {
      pool.query(query, params, (err, result) => {
        callback(err, result && result.rows.length > 0 ? result.rows[0] : null);
      });
    },
    run: (query, params, callback) => {
      // Convert SQLite-style queries to PostgreSQL
      const pgQuery = query
        .replace(/\?/g, (match, offset) => {
          const count = query.substring(0, offset).split('?').length;
          return `$${count}`;
        })
        .replace(/AUTOINCREMENT/gi, '');
      
      pool.query(pgQuery + ' RETURNING id', params, (err, result) => {
        if (callback) {
          // Mimic SQLite's this.lastID
          const context = { lastID: result && result.rows.length > 0 ? result.rows[0].id : null };
          callback.call(context, err);
        }
      });
    }
  };
} else {
  // SQLite for development
  const sqlite3 = require("sqlite3").verbose();
  db = new sqlite3.Database("./inventory.db");

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      quantity INTEGER,
      cost REAL DEFAULT 0
    )`, (err) => {
      if (err) {
        console.error("Error creating table:", err);
      }
    });
    
    // Add cost column if it doesn't exist (for existing databases without it)
    db.run(`ALTER TABLE items ADD COLUMN cost REAL DEFAULT 0`, (err) => {
      // Ignore error if column already exists
      if (err && !err.message.includes('duplicate column')) {
        console.error("Error adding cost column:", err);
      }
    });
  });
}

module.exports = db;
