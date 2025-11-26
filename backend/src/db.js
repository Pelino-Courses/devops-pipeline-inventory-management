const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./inventory.db");

db.serialize(() => {
  // Create table with all columns if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    quantity INTEGER,
    cost REAL DEFAULT 0
  )`, (err) => {
    if (err) {
      console.error("Error creating table:", err);
      return;
    }
    
    // Check if cost column exists and add it if needed (for existing databases)
    db.all("PRAGMA table_info(items)", [], (err, columns) => {
      if (err) {
        console.error("Error checking columns:", err);
        return;
      }
      
      const hasCostColumn = columns.some(col => col.name === 'cost');
      if (!hasCostColumn) {
        db.run("ALTER TABLE items ADD COLUMN cost REAL DEFAULT 0", (err) => {
          if (err) console.error("Error adding cost column:", err);
          else console.log("Added cost column to existing database");
        });
      }
    });
  });
});

module.exports = db;
