import {useGlobalState} from "../../global-config/GlobalConfig";
import {useQuery} from "@tanstack/react-query";
import {getLedgerInfo, getRecentBlocks} from "..";

export function useGetMostRecentBlocks(
  start: string | undefined,
  count: number,
) {
  const [state] = useGlobalState();

  const {isLoading: isLoadingLedgerData, data: ledgerData} = useQuery({
    queryKey: ["ledgerInfo", state.network_value],
    queryFn: () => getLedgerInfo(state.aptos_client),
  });
  const currentBlockHeight = start
    ? parseInt(start)
    : ledgerData?.block_height
      ? parseInt(ledgerData.block_height)
      : undefined;

  const {isLoading: isLoading, data: blocks} = useQuery({
    queryKey: ["block", currentBlockHeight, state.network_value],
    queryFn: async () => {
      if (currentBlockHeight !== undefined && !isNaN(currentBlockHeight)) {
        return getRecentBlocks(currentBlockHeight, count, state.aptos_client);
      }
      return [];
    },
    enabled: currentBlockHeight !== undefined && !isNaN(currentBlockHeight),
  });

  // Combine loading states to ensure we show loading while waiting for ledger data OR block data
  // Also consider it loading if we don't have block data yet but are enabled
  const combinedIsLoading = isLoadingLedgerData || isLoading;

  return {
    recentBlocks: blocks || [],
    isLoading: combinedIsLoading,
  };
}
