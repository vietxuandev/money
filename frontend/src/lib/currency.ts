import type { Currency } from "../generated/graphql";

export const formatCurrency = (amount: number, currency: Currency): string => {
  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  switch (currency) {
    case "VND":
      return `${formattedAmount} ₫`;
    case "USD":
      return `$${formattedAmount}`;
    default:
      return formattedAmount;
  }
};
