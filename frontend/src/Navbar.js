import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="nav-brand">Inventory App</Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/items">Items</Link>
                    <Link to="/items/new" className="btn small">+ New Item</Link>
                </div>
            </div>
        </nav>
    );
}
