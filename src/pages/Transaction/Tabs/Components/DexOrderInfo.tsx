import * as React from "react";
import {Box} from "@mui/material";
import {Types} from "aptos";
import {
  Side,
  OrderBasicType,
  TimeInForce,
  MarginMode,
} from "@aptos-labs/ts-sdk";
import ContentBox from "../../../../components/IndividualPageContent/ContentBox";
import ContentRow from "../../../../components/IndividualPageContent/ContentRow";
import {grey, negativeColor} from "../../../../themes/colors/aptosColorPalette";
import {
  useGetPerpetuals,
  Perpetual,
} from "../../../../api/hooks/useGetPerpetuals";

// Color constants
const positiveColor = "#4ade80"; // Green (Long/Buy)
const redColor = negativeColor; // Red (Short/Sell)

type DexPayload = {
  type: "dex_payload";
  orders: Array<{
    subaccount: string;
    symbol_id: number;
    symbol_type: number;
    side: number;
    quantums: string;
    subticks: string;
    order_basic_type: number;
    time_in_force: number;
    condition_type: number;
    target_order_id: string;
    margin_mode: number;
    reduce_only: boolean;
    position_mode: number;
  }>;
  operation: number;
  created_by: number;
};

// USDC quote_atomic_resolution is fixed at -6
const QUOTE_ATOMIC_RESOLUTION = -6;

/**
 * Calculate price and size from Perpetual data
 *
 * Formulas:
 * - quantums = size × 10^(-quantum_conversion_exponent)
 *   => size = quantums / 10^(-quantum_conversion_exponent)
 *          = quantums × 10^(quantum_conversion_exponent)
 *
 * - subticks = price × 10^(-quantum_conversion_exponent + base_atomic_resolution - quote_atomic_resolution)
 *   => price = subticks / 10^(-quantum_conversion_exponent + base_atomic_resolution - quote_atomic_resolution)
 */
function calculatePriceAndSize(
  order: {quantums: string; subticks: string},
  perpetual: Perpetual,
) {
  // size = quantums × 10^(quantum_conversion_exponent)
  const size =
    Number(order.quantums) *
    Math.pow(10, perpetual.quantum_conversion_exponent);

  // price = subticks / subtick_multiplier
  const subtickMultiplier = Math.pow(
    10,
    -perpetual.quantum_conversion_exponent +
      perpetual.base_atomic_resolution -
      QUOTE_ATOMIC_RESOLUTION,
  );
  const price = Number(order.subticks) / subtickMultiplier;

  return {price, size};
}

// Extract base token from ticker (e.g., "BTC-USD" → "BTC")
function extractBaseToken(ticker: string): string {
  return ticker.split("-")[0] || "TOKEN";
}

// Extract quote token from ticker (e.g., "BTC-USD" → "USD")
function extractQuoteToken(ticker: string): string {
  return ticker.split("-")[1] || "USD";
}

// Order type labels mapping using SDK enum
const ORDER_TYPE_LABELS: Record<OrderBasicType, string> = {
  [OrderBasicType.Unspecified]: "Unspecified",
  [OrderBasicType.Market]: "Market Order",
  [OrderBasicType.Limit]: "Limit Order",
};

// Side labels with colors using SDK enum
const SIDE_LABELS: Record<Side, {label: string; color: string}> = {
  [Side.Unspecified]: {label: "Unspecified", color: grey[500]},
  [Side.Buy]: {label: "Long", color: positiveColor},
  [Side.Sell]: {label: "Short", color: redColor},
};

// Get side label considering reduce_only flag
function getSideLabel(
  side: Side,
  reduceOnly: boolean,
): {label: string; color: string} {
  if (reduceOnly) {
    // When reduce_only is true, it's closing a position
    if (side === Side.Buy) {
      // Buy to close = closing a Short position
      return {label: "Close Short", color: positiveColor};
    } else if (side === Side.Sell) {
      // Sell to close = closing a Long position
      return {label: "Close Long", color: redColor};
    }
  }
  return SIDE_LABELS[side] || {label: "Unknown", color: grey[500]};
}

// Time In Force labels using SDK enum
const TIME_IN_FORCE_LABELS: Record<TimeInForce, string> = {
  [TimeInForce.Unspecified]: "Unspecified",
  [TimeInForce.Ioc]: "IOC",
  [TimeInForce.Fok]: "FOK",
  [TimeInForce.Aon]: "AON",
  [TimeInForce.Gtc]: "GTC",
  [TimeInForce.Alo]: "ALO",
  [TimeInForce.Gtd]: "GTD",
  [TimeInForce.Gtb]: "GTB",
};

// Margin Mode labels using SDK enum
const MARGIN_MODE_LABELS: Record<MarginMode, string> = {
  [MarginMode.Cross]: "Cross",
  [MarginMode.Isolated]: "Isolated",
  [MarginMode.Portfolio]: "Portfolio",
};

interface DexOrderInfoProps {
  transaction: Types.Transaction;
}

export default function DexOrderInfo({transaction}: DexOrderInfoProps) {
  // Fetch perpetuals data (must be called before any conditional returns)
  const {data: perpetuals, isLoading, error} = useGetPerpetuals();

  if (
    !("payload" in transaction) ||
    transaction.payload.type !== "dex_payload"
  ) {
    return null;
  }

  const payload = transaction.payload as unknown as DexPayload;
  const order = payload.orders[0]; // Assume we only display the first order

  // Don't render if data is still loading or failed to load
  if (isLoading || error || !perpetuals) {
    return null;
  }

  // Find the corresponding perpetual by symbol_id
  const perpetual = perpetuals.find((p) => p.perpetual_id === order.symbol_id);

  if (!perpetual) {
    console.warn(`No perpetual found for symbol_id: ${order.symbol_id}`);
    return null;
  }

  // Calculate price and size using perpetual data
  const {price, size} = calculatePriceAndSize(order, perpetual);
  const notionalValue = price * size;

  // Debug information
  console.log("DexOrderInfo - Order data:", {
    symbol_id: order.symbol_id,
    quantums: order.quantums,
    subticks: order.subticks,
    perpetual_ticker: perpetual.ticker,
    quantum_conversion_exponent: perpetual.quantum_conversion_exponent,
    base_atomic_resolution: perpetual.base_atomic_resolution,
    quote_atomic_resolution: QUOTE_ATOMIC_RESOLUTION,
    calculated_price: price,
    calculated_size: size,
    notional: notionalValue,
  });

  // Extract token information
  const baseToken = extractBaseToken(perpetual.ticker);
  const quoteToken = extractQuoteToken(perpetual.ticker);
  const pair = `${baseToken} / ${quoteToken}`;

  const orderType =
    ORDER_TYPE_LABELS[order.order_basic_type as OrderBasicType] || "Unknown";
  const sideInfo = getSideLabel(order.side as Side, order.reduce_only);
  const tif =
    TIME_IN_FORCE_LABELS[order.time_in_force as TimeInForce] || "Unknown";
  const marginMode =
    MARGIN_MODE_LABELS[order.margin_mode as MarginMode] || "Unknown";

  return (
    <Box marginBottom={3}>
      <ContentBox padding={4}>
        <ContentRow title="Type:" value={orderType} />
        <ContentRow title="Pair:" value={pair} />
        <ContentRow
          title="Side:"
          value={
            <Box sx={{color: sideInfo.color, fontWeight: 600}}>
              {sideInfo.label}
            </Box>
          }
        />
        <ContentRow
          title="Notional:"
          value={`≈ $${notionalValue.toFixed(2)}`}
        />
        <ContentRow title="Price:" value={`$${price.toFixed(5)}`} />
        <ContentRow
          title="Size:"
          value={`${size.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 8,
          })} ${baseToken}`}
        />
        <ContentRow title="Time In Force:" value={tif} />
        <ContentRow title="Margin Mode:" value={marginMode} />
      </ContentBox>
    </Box>
  );
}
