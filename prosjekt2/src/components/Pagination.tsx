import React, { useEffect, useState } from 'react';
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isSmallScreen?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const paginationLinks: number[] = [];
  const showPagesAround = 2;

  if (isSmallScreen) {
    if (currentPage > 1) paginationLinks.push(currentPage - 1);
    paginationLinks.push(currentPage);
    if (currentPage < totalPages) paginationLinks.push(currentPage + 1);
  } else {
    paginationLinks.push(1);

    for (
      let i = currentPage - showPagesAround;
      i <= currentPage + showPagesAround;
      i++
    ) {
      if (i > 1 && i < totalPages) {
        paginationLinks.push(i);
      }
    }

    paginationLinks.push(totalPages);
  }

  const uniquePages = Array.from(new Set(paginationLinks)).sort(
    (a, b) => a - b
  );
  const pagesToShow = uniquePages.reduce(
    (result: (number | string)[], page: number, index: number) => {
      if (index > 0 && page !== uniquePages[index - 1] + 1) {
        result.push('...');
      }
      result.push(page);
      return result;
    },
    [] as (number | string)[]
  );

  return (
    <div className="flex flex-wrap justify-center">
      <PaginationContent className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-3">
        {currentPage > 1 && (
          <PaginationItem className="flex-shrink-0">
            <PaginationPrevious
              href="#"
              onClick={() => onPageChange(currentPage - 1)}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="inline sm:hidden">◀</span>
            </PaginationPrevious>
          </PaginationItem>
        )}
        {pagesToShow.map((page, index) =>
          typeof page === 'string' ? (
            <span key={index} className="text-xs sm:text-sm">
              ...
            </span>
          ) : (
            <PaginationItem key={index} className="flex-shrink-0">
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => onPageChange(page)}
                href="#"
                className="text-xs sm:text-sm px-1 sm:px-2"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        {currentPage < totalPages && (
          <PaginationItem className="flex-shrink-0">
            <PaginationNext
              href="#"
              onClick={() => onPageChange(currentPage + 1)}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="inline sm:hidden">▶</span>
            </PaginationNext>
          </PaginationItem>
        )}
      </PaginationContent>
    </div>
  );
};

export default Pagination;
