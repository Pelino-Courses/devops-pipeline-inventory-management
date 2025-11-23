import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container" style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Inventory Management System</h1>
      <p style={{ color: "#6b7280", marginTop: "1rem", fontSize: "1.1rem" }}>
        Manage your items efficiently with our modern dashboard.
      </p>
      <div style={{ marginTop: "2rem" }}>
        <Link to="/items" className="btn" style={{ fontSize: "1.1rem", padding: "0.75rem 1.5rem" }}>
          Get Started
        </Link>
      </div>
    </div>
  );
}
