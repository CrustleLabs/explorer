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
 * Skeleton row for transaction table
 * Matches the table row structure with 5 columns
 */
export function SkeletonTableRow() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1.5,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Version */}
      <SkeletonBlock width={60} height={18} />
      {/* Status */}
      <SkeletonBlock width={70} height={18} />
      {/* User */}
      <SkeletonBlock width={120} height={18} />
      {/* Actions / Details */}
      <Box sx={{flex: 1, display: "flex", gap: 1}}>
        <SkeletonBlock width={100} height={18} />
        <SkeletonBlock width={80} height={18} />
      </Box>
      {/* Timestamp */}
      <SkeletonBlock width={100} height={18} />
    </Box>
  );
}

/**
 * Skeleton table with header and multiple rows
 */
interface SkeletonTableProps {
  rowCount?: number;
}

export function SkeletonTable({rowCount = 10}: SkeletonTableProps) {
  return (
    <Box>
      {/* Table header skeleton */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box sx={{width: 60, color: "#666", fontSize: 12}}>Version</Box>
        <Box sx={{width: 70, color: "#666", fontSize: 12}}>Status ⓘ</Box>
        <Box sx={{width: 120, color: "#666", fontSize: 12}}>User</Box>
        <Box sx={{flex: 1, color: "#666", fontSize: 12}}>Actions / Details</Box>
        <Box sx={{width: 100, color: "#666", fontSize: 12}}>Timestamp</Box>
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
