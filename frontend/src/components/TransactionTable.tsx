import { format, parseISO } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("common.date")}</TableHead>
          <TableHead>{t("common.category")}</TableHead>
          <TableHead>{t("common.note")}</TableHead>
          <TableHead className="text-right">{t("common.amount")}</TableHead>
          <TableHead className="text-right">{t("common.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              {t("common.loading")}
            </TableCell>
          </TableRow>
        ) : transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              {type === "expense"
                ? t("expenses.noExpensesYet")
                : t("incomes.noIncomesYet")}
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {format(parseISO(transaction.date), "dd/MM/yyyy", { locale })}
              </TableCell>
              <TableCell>{transaction.category.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {transaction.note || "-"}
              </TableCell>
              <TableCell
                className={`font-semibold ${amountColorClass} text-right`}
              >
                {formatCurrency(transaction.amount, currency)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
