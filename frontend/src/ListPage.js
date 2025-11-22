import { useEffect, useState } from "react";
import { getItems, deleteItem } from "./api";
import { Link } from "react-router-dom";

export default function ListPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  function load() {
    getItems().then(setItems);
  }

  function remove(id) {
    deleteItem(id).then(load);
  }

  return (
    <div className="container">
      <h2>Items</h2>
      <Link to="/items/new" className="btn">+ Add New</Link>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Qty</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.name}</td>
              <td>{i.quantity}</td>
              <td>
                <Link to={`/items/edit/${i.id}`} className="btn small">Edit</Link>
                <button onClick={() => remove(i.id)} className="btn small blue">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
