import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <style>{`
        .premium-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;

          height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 34px;

          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);

          border-bottom: 1px solid rgba(226, 232, 240, 0.95);

          box-shadow: 0 6px 25px rgba(15, 23, 42, 0.05);
        }

        .premium-brand {
          display: flex;
          align-items: center;
          gap: 12px;

          text-decoration: none;
        }

        .premium-brand-icon {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          color: white;

          font-weight: 900;
          font-size: 17px;

          box-shadow:
            0 8px 20px rgba(79, 70, 229, 0.25);
        }

        .premium-brand-text {
          display: flex;
          flex-direction: column;

          line-height: 1.1;
        }

        .premium-brand-main {
          color: #172033;

          font-size: 18px;
          font-weight: 850;

          letter-spacing: -0.4px;
        }

        .premium-brand-sub {
          margin-top: 4px;

          color: #8b95a7;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 1.4px;
        }

        .premium-nav-links {
          display: flex;
          align-items: center;

          gap: 6px;

          padding: 5px;

          border-radius: 13px;

          background: #f8fafc;

          border: 1px solid #edf0f5;
        }

        .premium-nav-link {
          position: relative;

          display: flex;
          align-items: center;

          gap: 8px;

          padding: 10px 15px;

          border-radius: 9px;

          color: #64748b;

          font-size: 13px;
          font-weight: 750;

          text-decoration: none;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .premium-nav-link:hover {
          color: #4338ca;

          background: white;

          transform: translateY(-1px);
        }

        .premium-nav-link.active {
          background: white;

          color: #4338ca;

          box-shadow:
            0 4px 12px rgba(15, 23, 42, 0.07);
        }

        .premium-nav-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #cbd5e1;
        }

        .premium-nav-link.active .premium-nav-dot {
          background: #4f46e5;

          box-shadow:
            0 0 0 4px rgba(79, 70, 229, 0.10);
        }

        .premium-navbar-right {
          display: flex;
          align-items: center;

          gap: 12px;
        }

        .premium-status {
          display: flex;
          align-items: center;

          gap: 7px;

          padding: 8px 11px;

          border-radius: 999px;

          background: #f0fdf4;

          border: 1px solid #bbf7d0;

          color: #15803d;

          font-size: 10px;
          font-weight: 800;
        }

        .premium-status-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 0 4px rgba(34, 197, 94, 0.10);
        }

        @media (max-width: 850px) {
          .premium-status {
            display: none;
          }

          .premium-navbar {
            padding: 0 18px;
          }
        }

        @media (max-width: 650px) {
          .premium-navbar {
            height: auto;

            padding: 12px 14px;

            flex-direction: column;
            align-items: stretch;

            gap: 12px;
          }

          .premium-brand {
            justify-content: center;
          }

          .premium-nav-links {
            width: 100%;

            justify-content: space-between;
          }

          .premium-nav-link {
            flex: 1;

            justify-content: center;

            padding: 9px 8px;

            font-size: 11px;
          }

          .premium-brand-sub {
            display: none;
          }

          .premium-navbar-right {
            width: 100%;
          }
        }
      `}</style>

      <nav className="premium-navbar">

        {/* BRAND */}

        <Link to="/" className="premium-brand">
          <div className="premium-brand-icon">
            EA
          </div>

          <div className="premium-brand-text">
            <span className="premium-brand-main">
              EduAdapt AI
            </span>

            <span className="premium-brand-sub">
              STUDENT INTELLIGENCE
            </span>
          </div>
        </Link>


        {/* NAVIGATION */}

        <div className="premium-navbar-right">

          <div className="premium-nav-links">

            <Link
              className={`premium-nav-link ${
                isActive("/") ? "active" : ""
              }`}
              to="/"
            >
              <span className="premium-nav-dot"></span>
              Dashboard
            </Link>

            <Link
              className={`premium-nav-link ${
                isActive("/tasks") ? "active" : ""
              }`}
              to="/tasks"
            >
              <span className="premium-nav-dot"></span>
              Task Board
            </Link>

            <Link
              className={`premium-nav-link ${
                isActive("/analytics") ? "active" : ""
              }`}
              to="/analytics"
            >
              <span className="premium-nav-dot"></span>
              Analytics
            </Link>

          </div>

          <div className="premium-status">
            <span className="premium-status-dot"></span>
            AI Active
          </div>

        </div>

      </nav>
    </>
  );
}

export default Navbar;