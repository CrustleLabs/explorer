import {Box, keyframes} from "@mui/material";
import React from "react";

// Pulse animation for skeleton loading effect
const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
`;

interface SkeletonBlockProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  sx?: object;
}

/**
 * Reusable skeleton placeholder block component
 * Styled according to Figma design with pill shape and dark purple color
 */
export default function SkeletonBlock({
  width = "100%",
  height = 20,
  borderRadius = "100px",
  sx = {},
}: SkeletonBlockProps) {
  return (
    <Box
      sx={{
        width,
        height,
        borderRadius,
        backgroundColor: "#2C2835",
        animation: `${pulse} 1.5s ease-in-out infinite`,
        ...sx,
      }}
    />
  );
}

/**
 * Skeleton row for transaction table - matching Figma design
 * Has 6 visible skeleton columns: Version, Type, Status, User, Actions/Details, Timestamp
 */
// 120px 100px 140px 200px 1fr 200px
export function SkeletonTableRow() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "120px 100px 140px 200px 1fr 200px",
        alignItems: "center",
        gap: 0,
        py: 2,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        px: 2,
      }}
    >
      {/* Version */}
      <SkeletonBlock width={70} height={28} />

      {/* Type */}
      <Box sx={{display: "flex", justifyContent: "center"}}>
        <SkeletonBlock width={28} height={28} borderRadius={6} />
      </Box>

      {/* Status */}
      <SkeletonBlock width={80} height={28} />

      {/* User */}
      <SkeletonBlock width={140} height={28} />

      {/* Actions / Details */}
      <SkeletonBlock
        width="40%"
        height={28}
        sx={{maxWidth: 280, minWidth: 150}}
      />

      {/* Timestamp */}
      <Box sx={{display: "flex", justifyContent: "flex-end"}}>
        <SkeletonBlock width={140} height={28} />
      </Box>
    </Box>
  );
}

/**
 * Skeleton table with header and multiple rows - matching Figma design
 */
interface SkeletonTableProps {
  rowCount?: number;
}

export function SkeletonTable({rowCount = 10}: SkeletonTableProps) {
  return (
    <Box>
      {/* Table header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "120px 100px 140px 200px 1fr 200px",
          alignItems: "center",
          gap: 0,
          py: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          px: 2,
        }}
      >
        <Box sx={{color: "rgba(255,255,255,0.5)", fontSize: 14}}>Version</Box>
        <Box
          sx={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Type <span style={{opacity: 0.6}}>ⓘ</span>
        </Box>
        <Box sx={{color: "rgba(255,255,255,0.5)", fontSize: 14}}>Status</Box>
        <Box sx={{color: "rgba(255,255,255,0.5)", fontSize: 14}}>User</Box>
        <Box sx={{color: "rgba(255,255,255,0.5)", fontSize: 14}}>
          Actions / Details
        </Box>
        <Box
          sx={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 14,
            textAlign: "right",
          }}
        >
          Timestamp
        </Box>
      </Box>
      {/* Skeleton rows */}
      {Array.from({length: rowCount}).map((_, index) => (
        <SkeletonTableRow key={index} />
      ))}
    </Box>
  );
}

/**
 * Skeleton for stats card value area
 */
export function SkeletonStatsValue() {
  return (
    <SkeletonBlock
      width="80%"
      height={32}
      sx={{
        maxWidth: 150,
      }}
    />
  );
}

/**
 * Skeleton row for blocks table
 * Columns: Block, Age, Hash, Num Transactions, First Version, Last Version
 */
export function BlocksSkeletonTableRow() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        alignItems: "center",
        gap: 0,
        py: 2,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        px: 2,
      }}
    >
      {/* Block */}
      <SkeletonBlock width={100} height={28} />

      {/* Age */}
      <SkeletonBlock width={80} height={28} />

      {/* Hash */}
      <SkeletonBlock width={140} height={28} />

      {/* Num Transactions */}
      <Box sx={{display: "flex", justifyContent: "flex-end"}}>
        <SkeletonBlock width={60} height={28} />
      </Box>

      {/* First Version */}
      <Box sx={{display: "flex", justifyContent: "flex-end"}}>
        <SkeletonBlock width={120} height={28} />
      </Box>

      {/* Last Version */}
      <Box sx={{display: "flex", justifyContent: "flex-end"}}>
        <SkeletonBlock width={120} height={28} />
      </Box>
    </Box>
  );
}

/**
 * Skeleton table for blocks page
 */
export function BlocksSkeletonTable({rowCount = 10}: SkeletonTableProps) {
  return (
    <Box
      sx={{
        backgroundColor: "#16141A",
        border: "0.5px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "24px",
        p: "20px",
        mt: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            height: 32,
            width: 150,
            backgroundColor: "#2C2835",
            borderRadius: "4px",
          }}
        />
        <Box
          sx={{
            height: 40,
            width: 300,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "100px",
          }}
        />
      </Box>

      <Box>
        {/* Table header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            alignItems: "center",
            gap: 0,
            py: 1.5,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            px: 2,
          }}
        >
          <Box sx={{color: "rgba(255,255,255,0.5)", fontSize: 14}}>Block</Box>
          <Box sx={{color: "rgba(255,255,255,0.5)", fontSize: 14}}>Age</Box>
          <Box sx={{color: "rgba(255,255,255,0.5)", fontSize: 14}}>Hash</Box>
          <Box
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              textAlign: "right",
            }}
          >
            Num Transactions
          </Box>
          <Box
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              textAlign: "right",
            }}
          >
            First Version
          </Box>
          <Box
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              textAlign: "right",
            }}
          >
            Last Version
          </Box>
        </Box>
        {/* Skeleton rows */}
        {Array.from({length: rowCount}).map((_, index) => (
          <BlocksSkeletonTableRow key={index} />
        ))}
      </Box>
    </Box>
  );
}
