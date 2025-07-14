import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './app/contexts';
import { NavBar } from './shared/components/NavBar';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { LoginPage } from './app/components/LoginPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="container-fluid py-4">
                  <div>
                    <h1>Dashboard</h1>
                    <p>Welcome to the pump management system!</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <div className="container-fluid py-4">
                  <div>
                    <h1>Pump Overview</h1>
                    <p>Overview of all pumps will be displayed here.</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
