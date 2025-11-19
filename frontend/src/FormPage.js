import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItem, createItem, updateItem } from "./api";

export default function FormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({ name: "", quantity: 0 });

  useEffect(() => {
    if (id) {
      getItem(id).then(setData);
    }
  }, [id]);

  function save(e) {
    e.preventDefault();
    const fn = id ? updateItem : createItem;
    fn(id, data).then(() => navigate("/items"));
  }

  return (
    <div className="container">
      <h2>{id ? "Edit Item" : "Add Item"}</h2>

      <form onSubmit={save}>
        <label>Name</label>
        <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />

        <label>Quantity</label>
        <input type="number" value={data.quantity} onChange={e => setData({ ...data, quantity: e.target.value })} />

        <button className="btn">Save</button>
      </form>
    </div>
  );
}
