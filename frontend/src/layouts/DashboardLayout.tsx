import {
  LayoutDashboard,
  Settings,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const DashboardLayout = ({ children }: { children?: ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    {
      path: "/dashboard",
      label: t("nav.dashboard"),
      icon: <LayoutDashboard />,
      shortLabel: t("nav.dashboard"),
    },
    {
      path: "/expenses",
      label: t("nav.expenses"),
      icon: <TrendingDown />,
      shortLabel: t("nav.expenses"),
    },
    {
      path: "/incomes",
      label: t("nav.incomes"),
      icon: <TrendingUp />,
      shortLabel: t("nav.incomes"),
    },
    {
      path: "/settings",
      label: t("settings.title"),
      icon: <Settings />,
      shortLabel: t("settings.title"),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header - Hide on mobile, show on desktop */}
      <header className="bg-card shadow-sm border-b border-border hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/icon.png" alt="Money Manager" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-foreground">
                {t("nav.financeManager")}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                👤 {user?.username}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition"
              >
                {t("common.logout")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Show only on mobile */}
      <header className="bg-card shadow-sm border-b border-border md:hidden sticky top-0 z-40">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-2">
              <img src="/icon.png" alt="Money Manager" className="w-7 h-7" />
              <h1 className="text-lg font-bold text-foreground">
                Finance Manager
              </h1>
            </div>

            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
        {/* Desktop Navigation - Horizontal tabs */}
        <nav className="mb-6 hidden md:block">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition
                  ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-foreground hover:bg-accent"
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

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors
                ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}
              `}
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-xs font-medium">{link.shortLabel}</span>
              {isActive(link.path) && (
                <div className="absolute bottom-0 w-12 h-1 bg-primary rounded-t-full" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};
