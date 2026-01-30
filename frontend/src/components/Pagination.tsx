import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Field, FieldLabel } from "./ui/field";
import { usePageNumbers } from "../hooks/usePageNumbers";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

export const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
}: PaginationProps) => {
  const { t } = useTranslation();
  const pageNumbers = usePageNumbers({
    currentPage,
    totalPages,
  });

  const showControls = totalPages > 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
      {/* Rows per page selector */}
      {onItemsPerPageChange && itemsPerPage && (
        <Field orientation="horizontal" className="w-fit shrink-0">
          <FieldLabel
            htmlFor="select-rows-per-page"
            className="text-sm text-gray-600"
          >
            {t("pagination.itemsPerPage")}
          </FieldLabel>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              onItemsPerPageChange(Number(value));
              onPageChange(1); // Reset to first page when changing items per page
            }}
          >
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      )}

      {/* Item count info */}
      {totalItems !== undefined && itemsPerPage !== undefined && (
        <div className="text-sm text-gray-600 shrink-0">
          {t("pagination.showing", {
            start: Math.min((currentPage - 1) * itemsPerPage + 1, totalItems),
            end: Math.min(currentPage * itemsPerPage, totalItems),
            total: totalItems,
          })}
        </div>
      )}

      {/* Pagination controls */}
      {showControls && (
        <ShadcnPagination className="sm:justify-end sm:items-center">
          <PaginationContent>
            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
                className={
                  !hasPreviousPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* Page numbers - hidden on mobile */}
            <div className="hidden sm:contents">
              {pageNumbers.map((page, index) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
            </div>

            {/* Mobile page indicator */}
            <div className="sm:hidden px-3 text-sm font-medium text-gray-700">
              {currentPage} / {totalPages}
            </div>

            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => hasNextPage && onPageChange(currentPage + 1)}
                className={
                  !hasNextPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </ShadcnPagination>
      )}
    </div>
  );
};
