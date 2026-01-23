import {Box, Stack, Typography} from "@mui/material";
import React from "react";

type TotalValueCardProps = {
  address?: string;
  totalValue?: number;
  unrealizedPnl?: number;
  totalPnl?: number;
  totalTransactions?: number;
  firstActivity?: string;
};

export default function TotalValueCard({
  totalValue = 0,
  unrealizedPnl = 0,
  totalPnl = 0,
  totalTransactions = 0,
  firstActivity,
}: TotalValueCardProps) {
  const formatCurrency = (value: number) => {
    const prefix = value >= 0 ? "+$" : "-$";
    return `${prefix}${Math.abs(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getPnLColor = (value: number) => {
    return value >= 0 ? "#03A881" : "#DC2971";
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(31, 28, 37, 0.6)",
        border: "0.5px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "24px",
        p: 4,
        height: "100%",
      }}
    >
      {/* Total Value */}
      <Typography
        sx={{
          color: "#666",
          fontSize: "14px",
          fontFamily: '"SF Pro", sans-serif',
          mb: 0.5,
        }}
      >
        Total Value
      </Typography>
      <Typography
        sx={{
          color: "#fff",
          fontSize: "32px",
          fontWeight: 700,
          fontFamily: '"SF Pro", sans-serif',
          mb: 4,
        }}
      >
        $
        {totalValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>

      {/* Stats Grid */}
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{color: "#999", fontSize: "14px", fontFamily: '"SF Pro"'}}
          >
            Unrealized P&L
          </Typography>
          <Typography
            sx={{
              color: getPnLColor(unrealizedPnl),
              fontSize: "14px",
              fontFamily: '"SF Pro"',
            }}
          >
            {formatCurrency(unrealizedPnl)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{color: "#999", fontSize: "14px", fontFamily: '"SF Pro"'}}
          >
            Total P&L
          </Typography>
          <Typography
            sx={{
              color: getPnLColor(totalPnl),
              fontSize: "14px",
              fontFamily: '"SF Pro"',
            }}
          >
            {formatCurrency(totalPnl)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{color: "#999", fontSize: "14px", fontFamily: '"SF Pro"'}}
          >
            Total transactions
          </Typography>
          <Typography
            sx={{color: "#fff", fontSize: "14px", fontFamily: '"SF Pro"'}}
          >
            {totalTransactions}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{color: "#999", fontSize: "14px", fontFamily: '"SF Pro"'}}
          >
            First activity
          </Typography>
          <Typography
            sx={{color: "#fff", fontSize: "14px", fontFamily: '"SF Pro"'}}
          >
            {firstActivity
              ? new Date(
                  firstActivity.includes("T")
                    ? firstActivity
                    : Number(firstActivity) / 1000,
                ).toLocaleDateString()
              : "-"}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
