import {Box, Stack, Typography} from "@mui/material";
import React from "react";
import BTCIcon from "../../../assets/svg/perps/btc.svg?react";
import ETHIcon from "../../../assets/svg/perps/eth.svg?react";
import {Position} from "../../../utils/positionUtils";

const LOGO_MAP: Record<
  string,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  BTC: BTCIcon,
  ETH: ETHIcon,
};

function PositionCard({position}: {position: Position}) {
  const pnlColor = position.unrealizedPnl >= 0 ? "#03A881" : "#DC2971";
  const sizeColor = position.size >= 0 ? "#03A881" : "#DC2971";
  const typeColor = position.side === "short" ? "#DC2971" : "#03A881";
  const symbol = position.ticker.split("-")[0];
  const Icon = LOGO_MAP[symbol] || BTCIcon; // Fallback or handle unknown

  return (
    <Box
      sx={{
        backgroundColor: "rgba(31, 28, 37, 0.6)",
        border: "0.5px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "16px",
        p: 2,
        minWidth: 180,
        flex: "1 1 0",
      }}
    >
      {/* Header: Symbol + Type + Leverage */}
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Box
          sx={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon width="100%" height="100%" />
        </Box>
        <Typography
          sx={{
            color: "#fff",
            fontSize: "14px",
            fontFamily: '"SF Pro"',
            fontWeight: 600,
          }}
        >
          {symbol}
        </Typography>
        <Box
          sx={{
            backgroundColor: typeColor,
            borderRadius: "4px",
            px: 1,
            py: 0.25,
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {position.side}
          </Typography>
        </Box>
        <Typography
          sx={{color: "#666", fontSize: "12px", fontFamily: '"SF Pro"'}}
        >
          {position.leverage}x
        </Typography>
      </Stack>

      {/* Stats */}
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            sx={{color: "#666", fontSize: "12px", fontFamily: '"SF Pro"'}}
          >
            Size
          </Typography>
          <Typography
            sx={{color: sizeColor, fontSize: "12px", fontFamily: '"SF Pro"'}}
          >
            {position.size.toFixed(4)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            sx={{color: "#666", fontSize: "12px", fontFamily: '"SF Pro"'}}
          >
            Value
          </Typography>
          <Typography
            sx={{color: "#fff", fontSize: "12px", fontFamily: '"SF Pro"'}}
          >
            $
            {position.positionValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            sx={{color: "#666", fontSize: "12px", fontFamily: '"SF Pro"'}}
          >
            P&L
          </Typography>
          <Typography
            sx={{color: pnlColor, fontSize: "12px", fontFamily: '"SF Pro"'}}
          >
            {position.unrealizedPnl >= 0 ? "+" : ""}$
            {position.unrealizedPnl.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default function OpenPositions({
  positions = [],
}: {
  positions?: Position[];
}) {
  const totalPnL = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);

  if (positions.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: "rgba(31, 28, 37, 0.6)",
        border: "0.5px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "24px",
        p: 4,
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Typography
          sx={{
            color: "#fff",
            fontSize: "20px",
            fontWeight: 700,
            fontFamily: '"SF Pro", sans-serif',
          }}
        >
          Open Positions
        </Typography>
        <Typography
          sx={{
            color: totalPnL >= 0 ? "#03A881" : "#DC2971",
            fontSize: "14px",
            fontFamily: '"SF Pro"',
          }}
        >
          {totalPnL >= 0 ? "+" : ""}$
          {totalPnL.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      </Stack>

      {/* Position Cards */}
      <Stack direction="row" spacing={2} sx={{overflowX: "auto"}}>
        {positions.map((position, index) => (
          <PositionCard key={index} position={position} />
        ))}
      </Stack>
    </Box>
  );
}
