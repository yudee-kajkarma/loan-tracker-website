import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { AppShell } from "./components/AppShell";
import WelcomePage from "./pages/Welcome";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import PinPage from "./pages/Pin";
import DashboardPage from "./pages/Dashboard";
import { CreditPage, DebitPage } from "./pages/LoanList";
import LoanDetailPage from "./pages/LoanDetail";
import AddLoanPage from "./pages/AddLoan";
import EditLoanPage from "./pages/EditLoan";
import SettingsPage from "./pages/Settings";

function AuthGate({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const pinRequired = useAuthStore((s) => s.pinRequired);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="inline-block w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome" replace state={{ from: location }} />;
  }

  if (pinRequired) {
    return <Navigate to="/pin" replace />;
  }

  return <AppShell>{children}</AppShell>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const pinRequired = useAuthStore((s) => s.pinRequired);

  if (loading) return null;
  if (user && !pinRequired) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/welcome"
          element={
            <PublicOnly>
              <WelcomePage />
            </PublicOnly>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <LoginPage />
            </PublicOnly>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnly>
              <RegisterPage />
            </PublicOnly>
          }
        />
        <Route path="/pin" element={<PinPage />} />

        {/* Authenticated */}
        <Route
          path="/"
          element={
            <AuthGate>
              <DashboardPage />
            </AuthGate>
          }
        />
        <Route
          path="/credit"
          element={
            <AuthGate>
              <CreditPage />
            </AuthGate>
          }
        />
        <Route
          path="/debit"
          element={
            <AuthGate>
              <DebitPage />
            </AuthGate>
          }
        />
        <Route
          path="/loan/add"
          element={
            <AuthGate>
              <AddLoanPage />
            </AuthGate>
          }
        />
        <Route
          path="/loan/edit/:id"
          element={
            <AuthGate>
              <EditLoanPage />
            </AuthGate>
          }
        />
        <Route
          path="/loan/:id"
          element={
            <AuthGate>
              <LoanDetailPage />
            </AuthGate>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGate>
              <SettingsPage />
            </AuthGate>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
