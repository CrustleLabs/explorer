import {useQuery} from "@tanstack/react-query";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {getIndexerApiUrl} from "../../constants";
import {ResponseError, ResponseErrorType} from "../client";

// Leverage tier from indexer API
export type LeverageTier = {
  minNotionalUsd: string;
  maxNotionalUsd: string;
  maxLeverage: number;
  initialMarginFraction: string;
  maintenanceMarginFraction: string;
  maintenanceDeduction: string;
};

// Perpetual market data from indexer API /v1/perpetualMarkets
export type PerpetualMarket = {
  clobPairId: string;
  ticker: string;
  status: string;
  oraclePrice: string;
  markPrice: string;
  priceChange24H: string;
  priceChange24HValue: string;
  volume24H: string;
  trades24H: number;
  nextFundingRate: string;
  maxLeverage: number;
  initialMarginFraction: string;
  maintenanceMarginFraction: string;
  leverageTiers: LeverageTier[];
  openInterest: string;
  atomicResolution: number;
  quantumConversionExponent: number;
  tickSize: string;
  stepSize: string;
  stepBaseQuantums: number;
  subticksPerTick: number;
  marketType: string;
  openInterestLowerCap: string;
  openInterestUpperCap: string;
  baseOpenInterest: string;
  defaultFundingRate1H: string;
};

// Legacy Perpetual type for backward compatibility
export type Perpetual = {
  perpetual_id: number;
  ticker: string;
  market_id: number;
  default_funding_rate_ppm: number;
  max_funding_rate_ppm: number;
  min_funding_rate_ppm: number;
  impact_price_base_usd: number;
  last_funding_rate_ppm: number;
  funding_index: string;
  open_interest: number;
  status: number;
  perpetual_tier: number;
  adl_enable: boolean;
  step_base_quantums: string;
  subticks_per_tick: number;
  quantum_conversion_exponent: number;
  price_limit_ppm: number;
  oi_ratio_limit_ppm: number;
  base_oi_limit_usd: number;
  base_atomic_resolution: number;
  total_long_funding_payment: string;
  total_short_funding_received: string;
  max_quantums_per_order: number;
  // Optional fields (may not be present in API response)
  quote_atomic_resolution?: number;
  price_exponent?: number;
};

type PerpetualMarketsResponse = {
  code: number;
  message: string;
  data: {
    markets: Record<string, PerpetualMarket>;
  };
};

// Fetch perpetual markets from indexer API
async function fetchPerpetualMarkets(
  indexerApiUrl: string,
): Promise<Record<string, PerpetualMarket>> {
  const response = await fetch(`${indexerApiUrl}/v1/perpetualMarkets`);
  if (!response.ok) {
    throw {
      type: ResponseErrorType.UNHANDLED,
      message: `Failed to fetch perpetual markets: HTTP ${response.status}`,
    } as ResponseError;
  }
  const data: PerpetualMarketsResponse = await response.json();
  if (data.code !== 0) {
    throw {
      type: ResponseErrorType.UNHANDLED,
      message: `Failed to fetch perpetual markets: ${data.message}`,
    } as ResponseError;
  }
  return data.data?.markets || {};
}

// Convert PerpetualMarket to legacy Perpetual format for backward compatibility
function convertToLegacyFormat(
  ticker: string,
  market: PerpetualMarket,
): Perpetual {
  return {
    perpetual_id: parseInt(market.clobPairId, 10),
    ticker: ticker,
    market_id: parseInt(market.clobPairId, 10),
    default_funding_rate_ppm: parseFloat(market.defaultFundingRate1H) * 1000000,
    max_funding_rate_ppm: 0,
    min_funding_rate_ppm: 0,
    impact_price_base_usd: 0,
    last_funding_rate_ppm: parseFloat(market.nextFundingRate) * 1000000,
    funding_index: "0",
    open_interest: parseFloat(market.openInterest) || 0,
    status: market.status === "ACTIVE" ? 1 : 0,
    perpetual_tier: 0 /* default tier */,
    adl_enable: false,
    step_base_quantums: market.stepBaseQuantums.toString(),
    subticks_per_tick: market.subticksPerTick,
    quantum_conversion_exponent: market.quantumConversionExponent,
    price_limit_ppm: 0,
    oi_ratio_limit_ppm: 0,
    base_oi_limit_usd: 0,
    base_atomic_resolution: market.atomicResolution,
    total_long_funding_payment: "0",
    total_short_funding_received: "0",
    max_quantums_per_order: 0,
  };
}

// Main hook to get perpetual markets using the new indexer API
export function useGetPerpetualMarkets() {
  const [state] = useGlobalState();
  const indexerApiUrl = getIndexerApiUrl(state.network_name);

  return useQuery<Record<string, PerpetualMarket>, ResponseError>({
    queryKey: ["perpetualMarkets", indexerApiUrl],
    queryFn: () => fetchPerpetualMarkets(indexerApiUrl),
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every 1 minute
  });
}

// Legacy hook for backward compatibility - returns Perpetual[] format
export function useGetPerpetuals() {
  const {data: markets, ...rest} = useGetPerpetualMarkets();

  const perpetuals: Perpetual[] | undefined = markets
    ? Object.entries(markets).map(([ticker, market]) =>
        convertToLegacyFormat(ticker, market),
      )
    : undefined;

  return {
    ...rest,
    data: perpetuals,
  };
}
