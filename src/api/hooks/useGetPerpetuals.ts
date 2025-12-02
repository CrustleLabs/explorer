import {useQuery} from "@tanstack/react-query";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {ResponseError, ResponseErrorType} from "../client";

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

type PerpetualsResponse = {
  perpetuals: Perpetual[];
};

async function fetchPerpetuals(baseUrl: string): Promise<Perpetual[]> {
  const response = await fetch(`${baseUrl}/dex/perpetuals`);
  if (!response.ok) {
    throw {
      type: ResponseErrorType.UNHANDLED,
      message: `Failed to fetch perpetuals: HTTP ${response.status}`,
    } as ResponseError;
  }
  const data: PerpetualsResponse = await response.json();
  return data.perpetuals || [];
}

export function useGetPerpetuals() {
  const [state] = useGlobalState();
  const baseUrl = state.network_value;

  return useQuery<Perpetual[], ResponseError>({
    queryKey: ["perpetuals", baseUrl],
    queryFn: () => fetchPerpetuals(baseUrl),
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every 1 minute
  });
}
