import { useState } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialItemsPerPage?: number;
}

export function usePagination({
  initialPage = 1,
  initialItemsPerPage = 10,
}: UsePaginationProps = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const resetPagination = () => {
    setCurrentPage(initialPage);
    setItemsPerPage(initialItemsPerPage);
  };

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage: handlePageChange,
    setItemsPerPage: handleItemsPerPageChange,
    resetPagination,
  };
}
