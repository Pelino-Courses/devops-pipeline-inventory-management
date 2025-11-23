const express = require("express");
const db = require("./db");
const router = express.Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

router.get("/items", (req, res) => {
  db.all("SELECT * FROM items", [], (err, rows) => res.json(rows));
});

router.get("/items/:id", (req, res) => {
  db.get("SELECT * FROM items WHERE id = ?", [req.params.id], (err, row) => res.json(row));
});

router.post("/items", (req, res) => {
  const { name, quantity } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  db.run("INSERT INTO items (name, quantity) VALUES (?, ?)", [name, quantity], function () {
    res.json({ id: this.lastID });
  });
});

router.put("/items/:id", (req, res) => {
  const { name, quantity } = req.body;
  if (!name || !quantity) {
    return res.status(400).json({ error: "Name and quantity are required" });
  }
  db.run("UPDATE items SET name=?, quantity=? WHERE id=?", [name, quantity, req.params.id], () => {
    res.json({ updated: true });
  });
});

router.delete("/items/:id", (req, res) => {
  db.run("DELETE FROM items WHERE id=?", [req.params.id], () => {
    res.json({ deleted: true });
  });
});

module.exports = router;
