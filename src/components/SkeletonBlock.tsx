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
export function SkeletonTableRow() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "90px 60px 100px 130px 1fr 140px",
        alignItems: "center",
        gap: 3,
        py: 2,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Version */}
      <SkeletonBlock width={70} height={28} />
      {/* Type */}
      <SkeletonBlock width={28} height={28} borderRadius={6} />
      {/* Status */}
      <SkeletonBlock width={80} height={28} />
      {/* User */}
      <SkeletonBlock width={110} height={28} />
      {/* Actions / Details */}
      <SkeletonBlock width="70%" height={28} sx={{maxWidth: 280}} />
      {/* Timestamp */}
      <SkeletonBlock width={110} height={28} />
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
          gridTemplateColumns: "90px 60px 100px 130px 1fr 140px",
          alignItems: "center",
          gap: 3,
          py: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box sx={{color: "rgba(255,255,255,0.5)", fontSize: 14}}>Version</Box>
        <Box sx={{color: "rgba(255,255,255,0.5)", fontSize: 14}}>
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
