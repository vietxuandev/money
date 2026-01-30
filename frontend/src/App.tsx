import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./lib/apollo-client";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { IncomesPage } from "./pages/IncomesPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import SettingsPage from "./pages/SettingsPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SettingsProvider } from "./contexts/SettingsContext";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/incomes" element={<IncomesPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
