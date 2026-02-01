import { format, parseISO } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks/useSettings";
import { formatCurrency } from "../lib/currency";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface TransactionTableProps<
  T extends {
    id: string;
    date: string;
    amount: number;
    note: string | null;
    category: { name: string };
  },
> {
  transactions: T[];
  loading: boolean;
  type: "expense" | "income";
  onEdit: (transaction: T) => void;
  onDelete: (id: string) => void;
}

export const TransactionTable = <
  T extends {
    id: string;
    date: string;
    amount: number;
    note: string | null;
    category: { name: string };
  },
>({
  transactions,
  loading,
  type,
  onEdit,
  onDelete,
}: TransactionTableProps<T>) => {
  const { t, i18n } = useTranslation();
  const { currency } = useSettings();
  const locale = i18n.language === "vi" ? vi : enUS;

  const amountColorClass =
    type === "expense" ? "text-rose-600" : "text-emerald-600";

  const loadingKey =
    type === "expense" ? "expenses.loadingExpenses" : "incomes.loadingIncomes";
  const emptyKey =
    type === "expense" ? "expenses.noExpensesYet" : "incomes.noIncomesYet";

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t(loadingKey)}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">{t(emptyKey)}</div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("common.date")}
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("common.category")}
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("common.note")}
          </TableHead>
          <TableHead className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("common.amount")}
          </TableHead>
          <TableHead className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("common.actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
              {format(parseISO(transaction.date), "dd/MM/yyyy", { locale })}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
              {transaction.category.name}
            </TableCell>
            <TableCell className="px-6 py-4 text-sm text-muted-foreground">
              {transaction.note || "-"}
            </TableCell>
            <TableCell
              className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${amountColorClass} text-right`}
            >
              {formatCurrency(transaction.amount, currency)}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(transaction)}
                className="mr-2"
              >
                {t("common.edit")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction.id)}
                className="text-red-600 hover:text-red-900 hover:bg-red-50"
              >
                {t("common.delete")}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
