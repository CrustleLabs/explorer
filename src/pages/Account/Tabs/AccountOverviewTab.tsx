import {Stack, Box} from "@mui/material";
import React, {useMemo} from "react";
import TotalValueCard from "../Components/TotalValueCard";
import OpenPositions from "../Components/OpenPositions";
import RecentActivity from "../Components/RecentActivity";
import {useGetIndexerSubaccounts} from "../../../api/hooks/useGetIndexerSubaccounts";
import {useGetPerpetualMarkets} from "../../../api/hooks/useGetPerpetuals";
import {parsePositionsFromSubAccounts} from "../../../utils/positionUtils";
import {useGetRealizedPnl} from "../../../api/hooks/useGetRealizedPnl";
import {useGetAccountStats} from "../../../api/hooks/useGetAccountStats";

type AccountOverviewTabProps = {
  address: string;
};

export default function AccountOverviewTab({address}: AccountOverviewTabProps) {
  // Convert 66-char Aptos address to 42-char EVM address for Indexer API
  const evmAddress = address ? `0x${address.slice(-40)}` : "";
  const {data: indexerData} = useGetIndexerSubaccounts(evmAddress);
  const {realizedPnl} = useGetRealizedPnl(evmAddress); // Fetch Realized PnL
  const {totalTransactions, firstActivityTimestamp} =
    useGetAccountStats(address);

  const {data: markets} = useGetPerpetualMarkets();

  const positions = useMemo(() => {
    if (!indexerData?.subaccounts || !markets) return [];
    return parsePositionsFromSubAccounts(indexerData.subaccounts, markets);
  }, [indexerData, markets]);

  const {totalValue, unrealizedPnl, totalPnl} = useMemo(() => {
    // Total Value = Sum of Equity across all subaccounts
    const totalEquity =
      indexerData?.parsedSubaccounts.reduce((sum, s) => sum + s.equity, 0) || 0;

    // Unrealized P&L = Sum from all parsed positions
    const currentUnrealizedPnl = positions.reduce(
      (sum, p) => sum + p.unrealizedPnl,
      0,
    );

    // Total PnL = Realized + Unrealized
    const computedTotalPnl = realizedPnl + currentUnrealizedPnl;

    return {
      totalValue: totalEquity,
      unrealizedPnl: currentUnrealizedPnl,
      totalPnl: computedTotalPnl,
    };
  }, [indexerData, positions, realizedPnl]);

  return (
    <Stack spacing={4}>
      {/* Top Row: Total Value Card (50%) + Placeholder (50%) */}
      <Stack direction={{xs: "column", md: "row"}} spacing={4}>
        <Box flex={1}>
          <TotalValueCard
            address={address}
            totalValue={totalValue}
            unrealizedPnl={unrealizedPnl}
            totalPnl={totalPnl}
            totalTransactions={totalTransactions}
            firstActivity={firstActivityTimestamp}
          />
        </Box>
        <Box flex={1}>{/* Placeholder for future content */}</Box>
      </Stack>

      {/* Open Positions */}
      <OpenPositions positions={positions} />

      {/* Recent Activity */}
      <RecentActivity address={address} />
    </Stack>
  );
}
