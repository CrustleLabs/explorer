import {
  Side,
  OrderBasicType,
  TimeInForce,
  MarginMode,
} from "@aptos-labs/ts-sdk";
import {Perpetual} from "../api/hooks/useGetPerpetuals";
import {grey, negativeColor} from "../themes/colors/aptosColorPalette";

// Color constants
export const positiveColor = "#4ade80"; // Green (Long/Buy)
export const redColor = negativeColor; // Red (Short/Sell)

export type DexPayload = {
  type: "dex_orderless_payload";
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
 */
export function calculatePriceAndSize(
  order: {quantums: string; subticks: string},
  perpetual: Perpetual,
) {
  // size = quantums × 10^(base_atomic_resolution)
  const size =
    Number(order.quantums) * Math.pow(10, perpetual.base_atomic_resolution);

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
export function extractBaseToken(ticker: string): string {
  return ticker.split("-")[0] || "TOKEN";
}

// Extract quote token from ticker (e.g., "BTC-USD" → "USD")
export function extractQuoteToken(ticker: string): string {
  return ticker.split("-")[1] || "USD";
}

// Order type labels mapping using SDK enum
export const ORDER_TYPE_LABELS: Record<OrderBasicType, string> = {
  [OrderBasicType.Unspecified]: "Unspecified",
  [OrderBasicType.Market]: "Market Order",
  [OrderBasicType.Limit]: "Limit Order",
};

// Side labels with colors using SDK enum
export const SIDE_LABELS: Record<Side, {label: string; color: string}> = {
  [Side.Unspecified]: {label: "Unspecified", color: grey[500]},
  [Side.Buy]: {label: "Long", color: positiveColor},
  [Side.Sell]: {label: "Short", color: redColor},
};

// Get side label considering reduce_only flag
export function getSideLabel(
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
export const TIME_IN_FORCE_LABELS: Record<TimeInForce, string> = {
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
export const MARGIN_MODE_LABELS: Record<MarginMode, string> = {
  [MarginMode.Cross]: "Cross",
  [MarginMode.Isolated]: "Isolated",
  [MarginMode.Portfolio]: "Portfolio",
};
