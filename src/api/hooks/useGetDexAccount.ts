import {useQuery} from "@tanstack/react-query";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {useGetPerpetuals} from "./useGetPerpetuals";
import {useGetLeverageTiers} from "./useGetLeverageTiers";

export type DexPosition = {
  perpetual_id: number;
  market: string;
  symbol: string;
  side: "long" | "short";
  size: number;
  leverage: number;
  subAccountId: number;
};

export type SubAccountConfig = {
  subaccount_number: number;
  leverage_infos: {
    symbol_id: number;
    leverage: number;
  }[];
};

type DexAccountResponse = {
  accounts: {
    subaccount_number: number;
    perps: {
      perpetual_id: number;
      long_quantums: number;
      short_quantums: number;
    }[];
    leverage_infos?: {
      symbol_id: number;
      im_leverage: number;
      exponent: number;
    }[];
  }[];
};

export function calculateLeverage(im_leverage: number, exponent: number) {
  const imr = im_leverage * Math.pow(10, exponent);
  if (imr === 0) return 5;
  return Math.round(1 / imr);
}

export function useGetDexAccount(address: string) {
  const [state] = useGlobalState();
  const {data: perpetuals} = useGetPerpetuals();
  const {data: leverageTiersMap} = useGetLeverageTiers();
  const baseUrl = state.network_value;

  const fetchDexAccount = async () => {
    // Logic from user: replace /v1 if present to get base, then append /v1/dex/accounts/address
    const rootUrl = baseUrl.endsWith("/v1") ? baseUrl.slice(0, -3) : baseUrl;
    const url = `${rootUrl}/v1/dex/accounts/${address}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch dex account");
    }
    const data: DexAccountResponse = await response.json();
    const subAccounts = data.accounts;
    const allPositions: DexPosition[] = [];
    const subAccountConfigs: SubAccountConfig[] = [];

    if (!perpetuals) return {positions: [], subAccountConfigs: []};

    subAccounts.forEach((sub) => {
      const configs: SubAccountConfig["leverage_infos"] = [];
      if (sub.leverage_infos) {
        sub.leverage_infos.forEach((l) => {
          configs.push({
            symbol_id: l.symbol_id,
            leverage: calculateLeverage(l.im_leverage, l.exponent),
          });
        });
      }
      subAccountConfigs.push({
        subaccount_number: sub.subaccount_number,
        leverage_infos: configs,
      });

      // Helper to calculate effective leverage for active positions
      const getEffectiveLeverage = (targetSymbolId: number) => {
        const userConfig = configs.find((c) => c.symbol_id === targetSymbolId);
        if (userConfig) return userConfig.leverage;

        const perp = perpetuals.find((p) => p.perpetual_id === targetSymbolId);
        if (!perp) return 5;

        if (leverageTiersMap) {
          const tiers = leverageTiersMap.get(perp.perpetual_tier);
          if (tiers && tiers.length > 0) {
            const maxLev = Math.max(...tiers.map((t) => t.maxLeverage || 0));
            return maxLev > 0 ? maxLev : 20;
          }
        }
        return 5;
      };

      sub.perps.forEach((perp) => {
        const perpInfo = perpetuals.find(
          (p) => p.perpetual_id === perp.perpetual_id,
        );
        if (!perpInfo) return;

        const baseAtomicResolution = perpInfo.base_atomic_resolution ?? -9;
        const leverage = getEffectiveLeverage(perp.perpetual_id);
        const symbol = perpInfo.ticker.split("-")[0];

        if (perp.long_quantums > 0) {
          allPositions.push({
            perpetual_id: perp.perpetual_id,
            market: `${perpInfo.ticker}_PERP`,
            symbol: symbol,
            side: "long",
            size: perp.long_quantums * Math.pow(10, baseAtomicResolution),
            leverage: leverage,
            subAccountId: sub.subaccount_number,
          });
        }

        if (perp.short_quantums > 0) {
          allPositions.push({
            perpetual_id: perp.perpetual_id,
            market: `${perpInfo.ticker}_PERP`,
            symbol: symbol,
            side: "short",
            size: perp.short_quantums * Math.pow(10, baseAtomicResolution),
            leverage: leverage,
            subAccountId: sub.subaccount_number,
          });
        }
      });
    });

    return {positions: allPositions, subAccountConfigs};
  };

  return useQuery({
    queryKey: [
      "dexAccount",
      address,
      state.network_value,
      leverageTiersMap ? "tiers-loaded" : "no-tiers",
    ],
    queryFn: fetchDexAccount,
    enabled: !!address && !!perpetuals, // We allow running without tiers (it will fall back), but the queryKey update will trigger a re-run when tiers load.
    // If we strictly want to wait: enabled: !!address && !!perpetuals && !!leverageTiersMap
    // But user might want to see positions even if tiers fail.
    // Best approach: Keep enabled as is, but depend on queryKey to refetch when tiers arrive.
    staleTime: 10000,
  });
}
