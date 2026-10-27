import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        EduAdapt AI
      </Link>

      <div className="nav-links">
        <Link className="nav-link" to="/">
          Dashboard
        </Link>

        <Link className="nav-link" to="/tasks">
          Task Board
        </Link>

        <Link className="nav-link" to="/analytics">
          Analytics
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;