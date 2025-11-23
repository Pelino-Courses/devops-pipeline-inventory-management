import { useEffect, useState } from "react";
import { getItems, deleteItem } from "./api";
import { Link } from "react-router-dom";

export default function ListPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  function load() {
    getItems().then(setItems);
  }

  function remove(id) {
    if (window.confirm("Are you sure?")) {
      deleteItem(id).then(load);
    }
  }

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header-actions">
        <h2>Items Inventory</h2>
        <Link to="/items/new" className="btn">+ Add Item</Link>
      </div>

      <input
        type="text"
        placeholder="Search items..."
        className="search-bar"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Quantity</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: "center" }}>No items found</td></tr>
          ) : (
            filteredItems.map(i => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>{i.quantity}</td>
                <td>
                  <Link to={`/items/edit/${i.id}`} className="btn small" style={{ marginRight: "0.5rem" }}>Edit</Link>
                  <button onClick={() => remove(i.id)} className="btn small red">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
