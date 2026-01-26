import { useState } from "react";
import { NumericFormat, numericFormatter } from "react-number-format";
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
  const [timeRange, setTimeRange] = useState<TimeRange>("MONTH");

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
        <div className="text-gray-500">Loading statistics...</div>
      </div>
    );
  }

  const expenseData =
    stats?.expenseByCategory?.map((item) => ({
      name: item.categoryName,
      value: item.total,
      fill: stringToColor(item.categoryName),
    })) || [];

  const incomeData =
    stats?.incomeByCategory?.map((item) => ({
      name: item.categoryName,
      value: item.total,
      fill: stringToColor(item.categoryName),
    })) || [];

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Financial Overview
          </h2>

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
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
                >
                  {range.charAt(0) + range.slice(1).toLowerCase()}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Total Income</div>
          <div className="text-3xl font-bold mt-2">
            <NumericFormat
              value={stats?.totalIncome || 0}
              displayType="text"
              thousandSeparator=","
            />
          </div>
        </div>

        <div className="bg-linear-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Total Expenses</div>
          <div className="text-3xl font-bold mt-2">
            <NumericFormat
              value={stats?.totalExpense || 0}
              displayType="text"
              thousandSeparator=","
            />
          </div>
        </div>

        <div
          className={`bg-linear-to-br ${(stats?.balance || 0) >= 0 ? "from-violet-500 to-violet-600" : "from-amber-500 to-amber-600"} rounded-xl shadow-lg p-6 text-white`}
        >
          <div className="text-sm font-medium opacity-90">Balance</div>
          <div className="text-3xl font-bold mt-2">
            <NumericFormat
              value={stats?.balance || 0}
              displayType="text"
              thousandSeparator=","
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense by Category - Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expenses by Category
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
                    numericFormatter(String(value || 0), {
                      thousandSeparator: ",",
                    }),
                    "Amount",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No expense data available
            </div>
          )}
        </div>

        {/* Income by Category - Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Income by Category
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
                    numericFormatter(String(value || 0), {
                      thousandSeparator: ",",
                    }),
                    "Amount",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No income data available
            </div>
          )}
        </div>
      </div>

      {/* Income vs Expenses Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Income vs Expenses Comparison
        </h3>

        {/* Comparison Chart */}
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                {
                  name: "Income",
                  amount: stats?.totalIncome || 0,
                  fill: "#10b981",
                },
                {
                  name: "Expenses",
                  amount: stats?.totalExpense || 0,
                  fill: "#f43f5e",
                },
                {
                  name: "Balance",
                  amount: stats?.balance || 0,
                  fill: (stats?.balance || 0) >= 0 ? "#8b5cf6" : "#f59e0b",
                },
              ]}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) =>
                  numericFormatter(String(value), { thousandSeparator: "," })
                }
              />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip
                formatter={(value: number | undefined) => [
                  numericFormatter(String(value || 0), {
                    thousandSeparator: ",",
                  }),
                  "Amount",
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
