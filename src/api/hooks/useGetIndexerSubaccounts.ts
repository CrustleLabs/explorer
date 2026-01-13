import {useQuery} from "@tanstack/react-query";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {getIndexerApiUrl} from "../../constants";
import {ResponseError, ResponseErrorType} from "../client";

// Asset position from indexer API
export type IndexerAssetPosition = {
  size: string;
  symbol: string;
  side: "LONG" | "SHORT";
  assetId: string;
  subaccountNumber: number;
};

// Perpetual position from indexer API
export type IndexerPerpetualPosition = {
  market: string;
  status: string;
  side: "LONG" | "SHORT";
  size: string;
  maxSize: string;
  entryPrice: string;
  exitPrice?: string;
  realizedPnl: string;
  unrealizedPnl: string;
  createdAt: string;
  createdAtHeight: string;
  closedAt?: string;
  sumOpen: string;
  sumClose: string;
  netFunding: string;
  subaccountNumber: number;
};

// Subaccount from indexer API
export type IndexerSubaccount = {
  address: string;
  subaccountNumber: number;
  equity: string;
  freeCollateral: string;
  openPerpetualPositions: Record<string, IndexerPerpetualPosition>;
  assetPositions: Record<string, IndexerAssetPosition>;
  marginEnabled: boolean;
  updatedAtHeight: string;
};

// Response type from /v1/addresses/{address}
type AddressResponse = {
  code: number;
  message: string;
  data: {
    subaccounts: IndexerSubaccount[];
    totalTradingRewards: string;
  };
};

// Parsed subaccount data for easier consumption
export type ParsedSubaccount = {
  address: string;
  subaccountNumber: number;
  equity: number;
  freeCollateral: number;
  marginEnabled: boolean;
  updatedAtHeight: string;
  assetBalances: {
    symbol: string;
    size: number;
    side: "LONG" | "SHORT";
    assetId: string;
  }[];
  perpetualPositions: {
    market: string;
    status: string;
    side: "LONG" | "SHORT";
    size: number;
    entryPrice: number;
    unrealizedPnl: number;
    realizedPnl: number;
  }[];
};

// Fetch address subaccounts from indexer API
async function fetchAddressSubaccounts(
  indexerApiUrl: string,
  address: string,
): Promise<{subaccounts: IndexerSubaccount[]; totalTradingRewards: string}> {
  const response = await fetch(`${indexerApiUrl}/v1/addresses/${address}`);
  if (!response.ok) {
    throw {
      type: ResponseErrorType.UNHANDLED,
      message: `Failed to fetch address data: HTTP ${response.status}`,
    } as ResponseError;
  }
  const data: AddressResponse = await response.json();
  if (data.code !== 0) {
    throw {
      type: ResponseErrorType.UNHANDLED,
      message: `Failed to fetch address data: ${data.message}`,
    } as ResponseError;
  }
  return {
    subaccounts: data.data?.subaccounts || [],
    totalTradingRewards: data.data?.totalTradingRewards || "0",
  };
}

// Parse subaccount data into a more usable format
function parseSubaccount(subaccount: IndexerSubaccount): ParsedSubaccount {
  const assetBalances = Object.values(subaccount.assetPositions).map(
    (position) => ({
      symbol: position.symbol,
      size: parseFloat(position.size),
      side: position.side,
      assetId: position.assetId,
    }),
  );

  const perpetualPositions = Object.values(
    subaccount.openPerpetualPositions,
  ).map((position) => ({
    market: position.market,
    status: position.status,
    side: position.side,
    size: parseFloat(position.size),
    entryPrice: parseFloat(position.entryPrice),
    unrealizedPnl: parseFloat(position.unrealizedPnl),
    realizedPnl: parseFloat(position.realizedPnl),
  }));

  return {
    address: subaccount.address,
    subaccountNumber: subaccount.subaccountNumber,
    equity: parseFloat(subaccount.equity),
    freeCollateral: parseFloat(subaccount.freeCollateral),
    marginEnabled: subaccount.marginEnabled,
    updatedAtHeight: subaccount.updatedAtHeight,
    assetBalances,
    perpetualPositions,
  };
}

// Main hook to get address subaccounts from indexer API
export function useGetIndexerSubaccounts(address: string | undefined) {
  const [state] = useGlobalState();
  const indexerApiUrl = getIndexerApiUrl(state.network_name);

  return useQuery<
    {
      subaccounts: IndexerSubaccount[];
      parsedSubaccounts: ParsedSubaccount[];
      totalTradingRewards: string;
    },
    ResponseError
  >({
    queryKey: ["indexerSubaccounts", address, indexerApiUrl],
    queryFn: async () => {
      if (!address) {
        return {
          subaccounts: [],
          parsedSubaccounts: [],
          totalTradingRewards: "0",
        };
      }
      const result = await fetchAddressSubaccounts(indexerApiUrl, address);
      return {
        subaccounts: result.subaccounts,
        parsedSubaccounts: result.subaccounts.map(parseSubaccount),
        totalTradingRewards: result.totalTradingRewards,
      };
    },
    enabled: !!address,
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// Hook to get a specific subaccount by number
export function useGetIndexerSubaccount(
  address: string | undefined,
  subaccountNumber: number,
) {
  const {data, ...rest} = useGetIndexerSubaccounts(address);

  const subaccount = data?.parsedSubaccounts.find(
    (s) => s.subaccountNumber === subaccountNumber,
  );

  return {
    ...rest,
    data: subaccount,
    allSubaccounts: data?.parsedSubaccounts,
  };
}

// Hook to get total account equity across all subaccounts
export function useGetTotalAccountEquity(address: string | undefined) {
  const {data, ...rest} = useGetIndexerSubaccounts(address);

  const totalEquity =
    data?.parsedSubaccounts.reduce((sum, s) => sum + s.equity, 0) || 0;
  const totalFreeCollateral =
    data?.parsedSubaccounts.reduce((sum, s) => sum + s.freeCollateral, 0) || 0;

  return {
    ...rest,
    data: {
      totalEquity,
      totalFreeCollateral,
      subaccountCount: data?.parsedSubaccounts.length || 0,
    },
  };
}
