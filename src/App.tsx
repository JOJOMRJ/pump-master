import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './app/contexts';
import { NavBar } from './shared/components/NavBar';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import {
  AppLayout,
  AppHeader,
  AppMain,
  PageContainer,
  CenteredContainer,
} from './shared/components/AppLayout';
import { LoginPage } from './app/components/LoginPage';
import { PumpsPage } from './app/components/PumpsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <AppHeader>
            <NavBar />
          </AppHeader>

          <AppMain>
            <Routes>
              <Route
                path="/login"
                element={
                  <CenteredContainer>
                    <LoginPage />
                  </CenteredContainer>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PageContainer fluid>
                      <h1>Dashboard</h1>
                      <p>Welcome to the pump management system!</p>
                    </PageContainer>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pumps"
                element={
                  <ProtectedRoute>
                    <PageContainer fluid>
                      <PumpsPage />
                    </PageContainer>
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/login" replace />} />

              <Route
                path="*"
                element={
                  <CenteredContainer>
                    <h2>404 Not Found</h2>
                  </CenteredContainer>
                }
              />
            </Routes>
          </AppMain>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
