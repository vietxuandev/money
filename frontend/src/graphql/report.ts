import { gql } from "@apollo/client";

export const GET_REPORT_STATISTICS = gql`
  query ReportStatistics($range: String!, $referenceDate: DateTime) {
    reportStatistics(range: $range, referenceDate: $referenceDate) {
      totalIncome
      totalExpense
      balance
      totalAssets
      totalValue
      startDate
      endDate
      expenseByCategory {
        categoryId
        categoryName
        count
        total
      }
      incomeByCategory {
        categoryId
        categoryName
        count
        total
      }
    }
  }
`;

export const GET_OVERALL_TOTAL_VALUE = gql`
  query OverallTotalValue {
    overallTotalValue {
      totalValue
      totalIncome
      totalExpense
      totalAssets
    }
  }
`;
