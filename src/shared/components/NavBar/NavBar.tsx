import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, NavLink } from 'react-router-dom';
import { RxBell } from 'react-icons/rx';
import { PiStarFourFill } from 'react-icons/pi';
import { useAuth } from '../../../app/contexts';

export const NavBar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar expand="lg" className="bg-white border-bottom" variant="light">
      <Container fluid className="px-4">
        {/* Brand/Logo with icon */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center text-dark fw-bold text-decoration-none"
        >
          <PiStarFourFill className="me-2" />
          <span>PumpMaster</span>
        </Navbar.Brand>

        {isAuthenticated && <Navbar.Toggle aria-controls="basic-navbar-nav" />}

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links - Only when authenticated */}
          {isAuthenticated && (
            <Nav className="me-auto">
              <Nav.Link
                as={NavLink}
                to="/dashboard"
                className="text-muted px-3"
              >
                Dashboard
              </Nav.Link>
              <Nav.Link as={NavLink} to="/pumps" className="text-muted px-3">
                Pumps
              </Nav.Link>
              <Nav.Link as={NavLink} to="/reports" className="text-muted px-3">
                Reports
              </Nav.Link>
              <Nav.Link as={NavLink} to="/alerts" className="text-muted px-3">
                Alerts
              </Nav.Link>
            </Nav>
          )}

          {/* Right side content */}
          <div className="d-flex align-items-center">
            {/* Search Form - Only when authenticated */}
            {isAuthenticated && (
              <div className="position-relative me-3">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="ps-5 bg-light border-0 rounded-pill"
                  aria-label="Search"
                />
                <div
                  className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"
                  style={{ pointerEvents: 'none' }}
                >
                  🔍
                </div>
              </div>
            )}

            {isAuthenticated && (
              <>
                {/* Notification Icon */}
                <Button
                  variant="light"
                  className="rounded me-3 d-flex align-items-center justify-content-center border-0"
                  style={{ width: '40px', height: '40px' }}
                >
                  <RxBell className="text-muted" />
                </Button>

                {/* User Avatar Dropdown */}
                {user && (
                  <NavDropdown
                    title={
                      <div
                        className="rounded-circle bg-dark d-inline-flex align-items-center justify-content-center text-white"
                        style={{
                          width: '40px',
                          height: '40px',
                        }}
                      >
                        {(user?.name || 'User').charAt(0).toUpperCase()}
                      </div>
                    }
                    id="user-nav-dropdown"
                    align="end"
                  >
                    <NavDropdown.ItemText className="small text-muted">
                      {user.name}
                    </NavDropdown.ItemText>
                    <NavDropdown.ItemText className="small text-muted">
                      {user.email}
                    </NavDropdown.ItemText>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/settings">
                      Settings
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Sign out
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
