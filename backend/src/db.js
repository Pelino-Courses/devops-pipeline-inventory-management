const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./inventory.db");

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

module.exports = db;
