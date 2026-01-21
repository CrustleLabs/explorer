import {IndexerSubaccount} from "../api/hooks/useGetIndexerSubaccounts";
import {PerpetualMarket} from "../api/hooks/useGetPerpetuals";

export interface Position {
  perpetual_id: number;
  ticker: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  unrealizedPnl: number;
  leverage: number;
  margin: number;
  equity: number;
  markPrice: number;
  positionValue: number;
  funding: number;
  netFunding: number;
  roi: number;
}

export function calculateLeverage(
  im_leverage: string | number,
  exponent: string | number,
): number {
  const im =
    typeof im_leverage === "string" ? parseFloat(im_leverage) : im_leverage;
  const exp = typeof exponent === "string" ? parseFloat(exponent) : exponent;
  const imr = im * Math.pow(10, exp);
  if (imr === 0) return 5;
  return Math.round(1 / imr);
}

export function parsePositionsFromSubAccounts(
  subaccounts: IndexerSubaccount[],
  markets: Record<string, PerpetualMarket>,
): Position[] {
  const allPositions: Position[] = [];

  for (const subaccount of subaccounts) {
    if (!subaccount.openPerpetualPositions) continue;

    const equity = parseFloat(subaccount.equity);

    Object.values(subaccount.openPerpetualPositions).forEach((pos) => {
      // 1. Find market info
      const market = markets[pos.market];
      if (!market) return;

      const size = parseFloat(pos.size);
      const entryPrice = parseFloat(pos.entryPrice);
      const markPrice = parseFloat(market.markPrice) || entryPrice;
      const side = pos.side.toLowerCase() as "long" | "short";
      const netFunding = parseFloat(pos.netFunding || "0");
      const perpetualId = parseInt(market.clobPairId, 10);

      // 2. Calculate Effective Leverage
      let effectiveLeverage = 5; // Default

      // Priority 1: User Config
      const userConfig = subaccount.leverage_infos?.find(
        (l) => l.symbol_id === perpetualId,
      );

      if (userConfig) {
        effectiveLeverage = calculateLeverage(
          userConfig.im_leverage,
          userConfig.exponent,
        );
      } else {
        // Priority 2: Max leverage from market leverage tiers
        if (market.leverageTiers && market.leverageTiers.length > 0) {
          // Use max leverage from all tiers (typically the first tier has highest leverage)
          const maxLev = Math.max(
            ...market.leverageTiers.map((t) => t.maxLeverage),
          );
          effectiveLeverage = maxLev > 0 ? maxLev : 20;
        } else if (market.maxLeverage) {
          // Priority 3: Direct maxLeverage field from market
          effectiveLeverage = market.maxLeverage;
        } else {
          // Priority 4: Default fallback
          effectiveLeverage = 10;
        }
      }

      // 3. Dynamic Values
      const positionValue = size * markPrice;

      // PnL Calculation
      // Long: (Mark - Entry) * Size
      // Short: (Entry - Mark) * Size
      let pnl = 0;
      if (side === "long") {
        pnl = (markPrice - entryPrice) * size;
      } else {
        pnl = (entryPrice - markPrice) * size;
      }

      // Margin = Position Value / Leverage
      const margin = positionValue / effectiveLeverage;

      // ROI = PnL / Margin
      const roi = margin > 0 ? (pnl / margin) * 100 : 0;

      allPositions.push({
        perpetual_id: perpetualId,
        ticker: market.ticker, // e.g. "BTC-USDC"
        side,
        size,
        entryPrice,
        unrealizedPnl: pnl, // Set to calculated PnL
        leverage: effectiveLeverage,
        margin,
        equity,
        markPrice,
        positionValue,
        funding: netFunding,
        netFunding,
        roi,
      });
    });
  }

  return allPositions;
}
