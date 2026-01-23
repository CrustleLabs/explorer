import React from "react";
import {Box, Select, MenuItem, IconButton, Typography} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type BlockPaginationProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
};

export default function BlockPagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: BlockPaginationProps) {
  const totalPages = Math.ceil(count / rowsPerPage);
  const startItem = page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, count);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      if (page > 2) {
        pages.push("...");
      }

      // Show pages around current
      const start = Math.max(1, page - 1);
      const end = Math.min(totalPages - 2, page + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (page < totalPages - 3) {
        pages.push("...");
      }

      // Always show last page
      if (!pages.includes(totalPages - 1)) {
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
        px: 1,
      }}
    >
      {/* Left: Rows per page */}
      <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
        <Typography
          sx={{
            color: "#999",
            fontSize: "14px",
            fontFamily: '"SF Pro", sans-serif',
          }}
        >
          Rows per page:
        </Typography>
        <Select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          size="small"
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            backgroundColor: "#232227",
            borderRadius: "35px",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#fff",
            fontSize: "14px",
            fontFamily: '"SF Pro", sans-serif',
            minWidth: "70px",
            "& .MuiSelect-select": {
              py: 0.5,
              px: 1,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiSvgIcon-root": {
              color: "#fff",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: "#232227",
                border: "1px solid rgba(255,255,255,0.12)",
                "& .MuiMenuItem-root": {
                  color: "#fff",
                  fontSize: "14px",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(205, 185, 249, 0.2)",
                  },
                },
              },
            },
          }}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </Box>

      {/* Center: Page numbers */}
      <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
        <IconButton
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          size="small"
          sx={{
            color: page === 0 ? "#666" : "#999",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "...") {
            return (
              <Typography
                key={`ellipsis-${index}`}
                sx={{
                  color: "#999",
                  fontSize: "14px",
                  fontFamily: '"SF Pro", sans-serif',
                  px: 1,
                }}
              >
                ...
              </Typography>
            );
          }

          const pageIndex = pageNum as number;
          const isActive = pageIndex === page;

          return (
            <Box
              key={pageIndex}
              onClick={() => onPageChange(pageIndex)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundColor: isActive ? "#232227" : "transparent",
                border: isActive
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid transparent",
                color: isActive ? "#fff" : "#999",
                fontSize: "14px",
                fontFamily: '"SF Pro", sans-serif',
                fontWeight: isActive ? 510 : 400,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: isActive
                    ? "#232227"
                    : "rgba(255,255,255,0.05)",
                },
              }}
            >
              {pageIndex + 1}
            </Box>
          );
        })}

        <IconButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          size="small"
          sx={{
            color: page >= totalPages - 1 ? "#666" : "#999",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Right: Showing X to Y of Z entries */}
      <Typography
        sx={{
          color: "#666",
          fontSize: "14px",
          fontFamily: '"SF Pro", sans-serif',
        }}
      >
        Showing {startItem} to {endItem} of {count} entries
      </Typography>
    </Box>
  );
}
