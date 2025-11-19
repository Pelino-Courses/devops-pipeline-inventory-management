import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container">
      <h1>Inventory Management</h1>
      <Link to="/items" className="btn">View Items</Link>
    </div>
  );
}
