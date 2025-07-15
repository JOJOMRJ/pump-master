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
                path="/overview"
                element={
                  <ProtectedRoute>
                    <PageContainer fluid>
                      <h1>Pump Overview</h1>
                      <p>Overview of all pumps will be displayed here.</p>
                    </PageContainer>
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </AppMain>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
