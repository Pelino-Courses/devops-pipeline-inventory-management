import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItem, createItem, updateItem } from "./api";

export default function FormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({ name: "", quantity: 0, cost: 0 });

  useEffect(() => {
    if (id) {
      getItem(id).then(setData);
    }
  }, [id]);

  function save(e) {
    e.preventDefault();
    if (id) {
      updateItem(id, data).then(() => navigate("/items"));
    } else {
      createItem(data).then(() => navigate("/items"));
    }
  }

  return (
    <div className="container">
      <h2>{id ? "Edit Item" : "Add Item"}</h2>

      <form onSubmit={save}>
        <label>Name</label>
        <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />

        <label>Quantity</label>
        <input type="number" value={data.quantity} onChange={e => setData({ ...data, quantity: e.target.value })} />

        <label>Cost per Unit ($)</label>
        <input type="number" step="0.01" value={data.cost} onChange={e => setData({ ...data, cost: e.target.value })} />

        <button className="btn btn-save">Save</button>
      </form>
    </div>
  );
}
