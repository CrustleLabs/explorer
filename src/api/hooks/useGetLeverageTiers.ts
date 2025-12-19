import {useQuery} from "@tanstack/react-query";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {useGetPerpetuals} from "./useGetPerpetuals";

export type LeverageTierItem = {
  symbol_id: number;
  tier: number;
  min_notional: string;
  max_notional: string;
  im_leverage: number;
  mm_leverage: number;
  exponent: number;
  maintenance_deduction: string;
  maxLeverage?: number; // Calculated field
};

export type LeverageTierMap = Map<number, LeverageTierItem[]>;

export function useGetLeverageTiers() {
  const [state] = useGlobalState();
  const {data: perpetuals} = useGetPerpetuals();
  const baseUrl = state.network_value;

  const fetchLeverageTiers = async (): Promise<LeverageTierMap> => {
    if (!perpetuals) return new Map();

    const uniqueTiers = Array.from(
      new Set(perpetuals.map((p) => p.perpetual_tier)),
    );
    const map = new Map<number, LeverageTierItem[]>();

    const rootUrl = baseUrl.endsWith("/v1") ? baseUrl.slice(0, -3) : baseUrl;

    await Promise.all(
      uniqueTiers.map(async (tierId) => {
        try {
          const response = await fetch(
            `${rootUrl}/v1/dex/leverage_tiers/${tierId}`,
          );
          if (!response.ok) return; // Skip if failed
          const data = await response.json();

          // Safe check for data structure
          let items: LeverageTierItem[] = [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawData = data as any;

          if (Array.isArray(rawData?.leverage_infos)) {
            items = rawData.leverage_infos;
          }

          const parsedItems: LeverageTierItem[] = items.map((item) => ({
            ...item,
            maxLeverage: Math.round(
              1 / (item.im_leverage * Math.pow(10, item.exponent)),
            ),
          }));

          map.set(tierId, parsedItems);
        } catch (e) {
          console.error(`Failed to fetch tier ${tierId}`, e);
        }
      }),
    );

    return map;
  };

  return useQuery({
    queryKey: ["leverageTiers", baseUrl, perpetuals?.length], // Refetch if perps changes
    queryFn: fetchLeverageTiers,
    enabled: !!perpetuals && perpetuals.length > 0,
    staleTime: 600000, // Cache for 10 mins
  });
}
