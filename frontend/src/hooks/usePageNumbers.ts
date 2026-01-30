import { useMemo } from "react";

interface UsePageNumbersProps {
  currentPage: number;
  totalPages: number;
  maxVisible?: number;
}

export function usePageNumbers({
  currentPage,
  totalPages,
  maxVisible = 5,
}: UsePageNumbersProps) {
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, maxVisible]);

  return pageNumbers;
}
