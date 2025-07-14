import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../../app/contexts';

export const NavBar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="p-3 mb-3 border-bottom shadow">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          {/* Brand/Logo - Always visible */}
          <Link
            to="/"
            className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none"
          >
            <strong className="me-2">PumpMaster</strong>
          </Link>

          {/* Navigation Menu - Only when authenticated */}
          {isAuthenticated && (
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <NavLink to="/overview" className="nav-link px-2">
                  Overview
                </NavLink>
              </li>
              <li>
                <NavLink to="/pumps" className="nav-link px-2">
                  Pumps
                </NavLink>
              </li>
              <li>
                <NavLink to="/inspections" className="nav-link px-2">
                  Inspections
                </NavLink>
              </li>
              <li>
                <NavLink to="/reports" className="nav-link px-2">
                  Reports
                </NavLink>
              </li>
            </ul>
          )}

          {/* Right side content */}
          <div className="d-flex align-items-center">
            {/* Search Form - Only when authenticated */}
            {isAuthenticated && (
              <form className="me-3" role="search">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search pumps..."
                  aria-label="Search"
                />
              </form>
            )}

            {/* User Section */}
            {isAuthenticated && user && (
              <div className="dropdown text-end">
                <button
                  className="btn btn-link p-0 d-block link-body-emphasis text-decoration-none dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center text-white"
                    style={{ width: '32px', height: '32px', fontSize: '14px' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>
                <ul className="dropdown-menu text-small">
                  <li>
                    <span className="dropdown-item-text small text-muted">
                      {user.name}
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
