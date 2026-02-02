import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import { formatCurrency } from "../lib/currency";
import { useReportStatisticsQuery } from "../generated/graphql";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TimeRange = "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";

// Generate consistent color based on string (category name)
function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

export const DashboardPage = () => {
  const { t } = useTranslation();
  const { currency } = useSettings();
  const [timeRange, setTimeRange] = useState<TimeRange>("MONTH");
  const [showTotalValue, setShowTotalValue] = useState(true);

  const { data, loading } = useReportStatisticsQuery({
    variables: {
      range: timeRange,
      // Don't send referenceDate - backend will use current date by default
    },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  });

  const stats = data?.reportStatistics;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">
          {t("dashboard.loadingStats")}
        </div>
      </div>
    );
  }

  const expenseData = stats
    ? stats.expenseByCategory.map((item) => ({
        name: item.categoryName,
        value: item.total,
        fill: stringToColor(item.categoryName),
      }))
    : [];

  const incomeData = stats
    ? stats.incomeByCategory.map((item) => ({
        name: item.categoryName,
        value: item.total,
        fill: stringToColor(item.categoryName),
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Total Value Card - Featured at Top */}
      <div
        className={`bg-linear-to-br ${stats && stats.totalValue >= 0 ? "from-violet-500 to-violet-600" : "from-amber-500 to-amber-600"} rounded-xl shadow-lg p-8 text-white`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium opacity-90">
                {t("dashboard.totalValue")}
              </div>
              <button
                onClick={() => setShowTotalValue(!showTotalValue)}
                className="p-1 rounded hover:bg-white/20 transition"
                aria-label={showTotalValue ? "Hide total value" : "Show total value"}
              >
                {showTotalValue ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="text-5xl font-bold mt-2">
              {showTotalValue
                ? formatCurrency(stats ? stats.totalValue : 0, currency)
                : "••••••"}
            </div>
            <div className="text-sm opacity-75 mt-2">
              {t("dashboard.incomeMinusExpensesPlusAssets")}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["DAY", "WEEK", "MONTH", "QUARTER", "YEAR"] as TimeRange[]).map(
              (range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition
                  ${
                    timeRange === range
                      ? "bg-white/30 backdrop-blur-sm shadow-md"
                      : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  }
                `}
                >
                  {t(`dashboard.timeRange.${range.toLowerCase()}`)}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">
            {t("dashboard.totalIncome")}
          </div>
          <div className="text-3xl font-bold mt-2">
            {formatCurrency(stats ? stats.totalIncome : 0, currency)}
          </div>
        </div>

        <div className="bg-linear-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">
            {t("dashboard.totalExpenses")}
          </div>
          <div className="text-3xl font-bold mt-2">
            {formatCurrency(stats ? stats.totalExpense : 0, currency)}
          </div>
        </div>

        <div
          className={`bg-linear-to-br ${stats && stats.balance >= 0 ? "from-blue-500 to-blue-600" : "from-orange-500 to-orange-600"} rounded-xl shadow-lg p-6 text-white`}
        >
          <div className="text-sm font-medium opacity-90">
            {t("dashboard.balance")}
          </div>
          <div className="text-3xl font-bold mt-2">
            {formatCurrency(stats ? stats.balance : 0, currency)}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense by Category - Pie Chart */}
        <div className="bg-card rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            {t("dashboard.expensesByCategory")}
          </h3>
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: unknown) => {
                    const { name, percent } = props as {
                      name?: string;
                      percent?: number;
                    };
                    return `${name} ${((percent ?? 0) * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                ></Pie>
                <Tooltip
                  formatter={(value: number | undefined) => [
                    formatCurrency(value || 0, currency),
                    t("dashboard.amount"),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {t("dashboard.noData")}
            </div>
          )}
        </div>

        {/* Income by Category - Pie Chart */}
        <div className="bg-card rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            {t("dashboard.incomesByCategory")}
          </h3>
          {incomeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: unknown) => {
                    const { name, percent } = props as {
                      name?: string;
                      percent?: number;
                    };
                    return `${name} ${((percent ?? 0) * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                ></Pie>
                <Tooltip
                  formatter={(value: number | undefined) => [
                    formatCurrency(value || 0, currency),
                    t("dashboard.amount"),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {t("dashboard.noData")}
            </div>
          )}
        </div>
      </div>

      {/* Income vs Expenses Comparison */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">
          {t("dashboard.incomeVsExpenses")}
        </h3>

        {/* Comparison Chart */}
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                {
                  name: t("dashboard.income"),
                  amount: stats ? stats.totalIncome : 0,
                  fill: "#10b981",
                },
                {
                  name: t("dashboard.expenses"),
                  amount: stats ? stats.totalExpense : 0,
                  fill: "#f43f5e",
                },
                {
                  name: t("dashboard.balance"),
                  amount: stats ? stats.balance : 0,
                  fill: stats && stats.balance >= 0 ? "#8b5cf6" : "#f59e0b",
                },
              ]}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCurrency(value, currency)}
              />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip
                formatter={(value: number | undefined) => [
                  formatCurrency(value || 0, currency),
                  t("dashboard.amount"),
                ]}
              />
              <Bar dataKey="amount" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
