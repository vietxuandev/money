import { type ReactNode } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const DashboardLayout = ({ children }: { children?: ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/expenses", label: "Expenses", icon: "💸" },
    { path: "/incomes", label: "Incomes", icon: "💰" },
    { path: "/categories", label: "Categories", icon: "📁" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/icon.png" alt="Money Manager" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                Finance Manager
              </h1>
              <h1 className="text-xl font-bold text-gray-900 sm:hidden">
                Money
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:block">
                👤 {user?.username}
              </span>
              <button
                onClick={logout}
                className="px-3 py-2 sm:px-4 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation */}
        <nav className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition
                  ${
                    isActive(link.path)
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main>{children || <Outlet />}</main>
      </div>
    </div>
  );
};
