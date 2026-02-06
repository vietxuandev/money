import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useSettings";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useOverallTotalValueQuery,
  useReportStatisticsQuery,
} from "../generated/graphql";
import { formatCurrency } from "../lib/currency";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";

const TIME_RANGES = ["DAY", "WEEK", "MONTH", "QUARTER", "YEAR"];

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
  const [timeRange, setTimeRange] = useState("MONTH");
  const [showTotalValue, setShowTotalValue] = useState(false);

  // Query for time-filtered stats (for charts and summary cards)
  const { data, loading } = useReportStatisticsQuery({
    variables: {
      range: timeRange,
      // Don't send referenceDate - backend will use current date by default
    },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  });

  // Separate query for all-time total value (not filtered by time range)
  const { data: overallData, loading: overallLoading } =
    useOverallTotalValueQuery({
      fetchPolicy: "cache-first",
      nextFetchPolicy: "cache-first",
    });

  const stats = data?.reportStatistics;
  const overallTotal = overallData?.overallTotalValue;

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

  const toggleShowTotalValue = () => {
    setShowTotalValue(!showTotalValue);
  };

  return (
    <div className="space-y-6">
      {/* Total Value Card - Featured at Top */}
      <div
        className={`bg-linear-to-br ${overallTotal && overallTotal.totalValue >= 0 ? "from-violet-500 to-violet-600" : "from-amber-500 to-amber-600"} rounded-xl shadow-lg p-8 text-white`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium opacity-90">
                {t("dashboard.totalValue")}
              </div>
              <Button
                variant="ghost"
                onClick={toggleShowTotalValue}
                aria-label={
                  showTotalValue ? "Hide total value" : "Show total value"
                }
                size="icon"
              >
                {showTotalValue ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-5xl font-bold mt-2">
              {showTotalValue ? (
                overallLoading ? (
                  <Skeleton className="h-12 w-48" />
                ) : (
                  formatCurrency(
                    overallTotal ? overallTotal.totalValue : 0,
                    currency,
                  )
                )
              ) : (
                "••••••"
              )}
            </div>
            <div className="text-sm opacity-75 mt-2">
              {t("dashboard.incomeMinusExpensesPlusAssets")}
            </div>
          </div>
        </div>
      </div>
      <Field orientation="horizontal" className="justify-end">
        <Label>{t("dashboard.filterBy")}</Label>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {TIME_RANGES.map((range) => (
                <SelectItem key={range} value={range}>
                  {t(`dashboard.timeRange.${range.toLowerCase()}`)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">
            {t("dashboard.totalIncome")}
          </div>
          <div className="text-3xl font-bold mt-2">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              formatCurrency(stats ? stats.totalIncome : 0, currency)
            )}
          </div>
        </div>

        <div className="bg-linear-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">
            {t("dashboard.totalExpenses")}
          </div>
          <div className="text-3xl font-bold mt-2">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              formatCurrency(stats ? stats.totalExpense : 0, currency)
            )}
          </div>
        </div>

        <div
          className={`bg-linear-to-br ${stats && stats.balance >= 0 ? "from-blue-500 to-blue-600" : "from-orange-500 to-orange-600"} rounded-xl shadow-lg p-6 text-white`}
        >
          <div className="text-sm font-medium opacity-90">
            {t("dashboard.balance")}
          </div>
          <div className="text-3xl font-bold mt-2">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              formatCurrency(stats ? stats.balance : 0, currency)
            )}
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
