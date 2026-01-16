import React from "react";
import {
  Box,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tab,
  Tabs,
} from "@mui/material";
import {Types} from "aptos";
import {useGetIndexerSubaccounts} from "../../../../api/hooks/useGetIndexerSubaccounts";
import {useGetPerpetualMarkets} from "../../../../api/hooks/useGetPerpetuals";
import {parsePositionsFromSubAccounts} from "../../../../utils/positionUtils";
import BTCIcon from "../../../../assets/svg/perps/btc.svg?react";
import ETHIcon from "../../../../assets/svg/perps/eth.svg?react";

interface AllTransactionsSectionProps {
  transaction: Types.Transaction;
}

const LOGO_MAP: Record<
  string,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  BTC: BTCIcon,
  ETH: ETHIcon,
};

export default function AllTransactionsSection({
  transaction,
}: AllTransactionsSectionProps) {
  const [tabValue, setTabValue] = React.useState(0);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const txnAny = transaction as any;
  const isMint =
    txnAny.payload?.type === "entry_function_payload" &&
    (txnAny.payload?.function?.endsWith("::aptos_coin::mint") ||
      txnAny.payload?.function?.endsWith("::usdc::mint"));

  const sender = isMint
    ? txnAny.payload?.arguments?.[0] || txnAny.sender
    : txnAny.sender;

  const {data: indexerData, isLoading: isLoadingSubaccounts} =
    useGetIndexerSubaccounts(sender);
  const {data: markets, isLoading: isLoadingMarkets} = useGetPerpetualMarkets();

  const positions = React.useMemo(() => {
    if (!indexerData?.subaccounts || !markets) return [];
    return parsePositionsFromSubAccounts(indexerData.subaccounts, markets);
  }, [indexerData, markets]);

  const isLoading = isLoadingSubaccounts || isLoadingMarkets;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#16141a",
        border: "1.5px solid rgba(255,255,255,0.06)",
        borderRadius: "24px",
        padding: "24px",
        mt: 4,
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Box
          sx={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#8FC7FA",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              width: 24,
              height: 24,
            }}
          >
            <path
              d="M5.5 9.47139C6.94445 7.66667 9.44809 5.5 12.0006 5.5C15.3459 5.5 18.1009 8.02742 18.4603 11.277M5.5 9.47139V6.22139M5.5 9.47139H8.75M5.54129 12.7249C5.90198 15.9732 8.65633 18.4991 12.0006 18.4991C14.5514 18.4991 17.0556 16.3333 18.5 14.5269M18.5 14.5269V17.7769M18.5 14.5269H15.25"
              stroke="black"
              strokeWidth="1.86667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
        <Typography
          variant="h6"
          fontFamily='"SF Pro", sans-serif'
          fontWeight={700}
          fontSize="18px"
          color="#fff"
        >
          All Transactions
        </Typography>
      </Stack>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          mb: 2,
          minHeight: "32px",
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        <Tab
          label="Open Positions"
          sx={{
            color: tabValue === 0 ? "#fff" : "#999",
            fontWeight: tabValue === 0 ? 600 : 400,
            fontSize: "14px",
            fontFamily: '"SF Pro", sans-serif',
            textTransform: "none",
            minHeight: "32px",
            padding: "6px 12px",
          }}
        />
        <Tab
          label="Active Transactions"
          sx={{
            color: tabValue === 1 ? "#fff" : "#999",
            fontWeight: tabValue === 1 ? 600 : 400,
            fontSize: "14px",
            fontFamily: '"SF Pro", sans-serif',
            textTransform: "none",
            minHeight: "32px",
            padding: "6px 12px",
          }}
        />
        <Tab
          label="Spot Balances"
          sx={{
            color: tabValue === 2 ? "#fff" : "#999",
            fontWeight: tabValue === 2 ? 600 : 400,
            fontSize: "14px",
            fontFamily: '"SF Pro", sans-serif',
            textTransform: "none",
            minHeight: "32px",
            padding: "6px 12px",
          }}
        />
      </Tabs>

      {/* Open Positions Table */}
      {tabValue === 0 && (
        <Table
          size="small"
          sx={{
            "& td, & th": {
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              padding: "12px 8px",
            },
          }}
        >
          <TableHead>
            <TableRow>
              {[
                "Asset",
                "Mark",
                "Entry",
                "Positions Value",
                "PnL",
                "ROI",
                "Margin",
                "Funding",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: "#666",
                    fontSize: "11px",
                    fontFamily: '"SF Pro", sans-serif',
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography color="#666" fontSize="12px">
                    Loading...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : positions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{textAlign: "center", py: 4}}>
                  <Typography
                    color="#666"
                    fontSize="14px"
                    fontFamily='"SF Pro", sans-serif'
                  >
                    No open positions
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              positions.map((row, idx) => {
                const symbol = row.ticker.split("-")[0];
                const Icon = LOGO_MAP[symbol];
                return (
                  <TableRow key={idx}>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {Icon && <Icon width={16} height={16} />}
                        <Typography
                          color="#fff"
                          fontSize="13px"
                          fontFamily='"SF Pro", sans-serif'
                        >
                          {row.ticker}
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor:
                              row.side === "long"
                                ? "rgba(3, 168, 129, 0.12)"
                                : "rgba(220, 41, 113, 0.12)",
                            borderRadius: "4px",
                            px: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              color:
                                row.side === "long" ? "#03A881" : "#DC2971",
                              fontSize: "10px",
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {row.side}
                          </Typography>
                        </Box>
                        <Typography color="#999" fontSize="11px">
                          {row.leverage}x
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography color="#fff" fontSize="13px">
                        ${row.markPrice.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="#fff" fontSize="13px">
                        ${row.entryPrice.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="#DC2971" fontSize="13px">
                        ${row.positionValue.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color={row.unrealizedPnl >= 0 ? "#03A881" : "#DC2971"}
                        fontSize="13px"
                      >
                        {row.unrealizedPnl >= 0 ? "+" : ""}$
                        {row.unrealizedPnl.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color={row.roi >= 0 ? "#03A881" : "#DC2971"}
                        fontSize="13px"
                      >
                        {row.roi >= 0 ? "+" : ""}
                        {row.roi.toFixed(2)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="#fff" fontSize="13px">
                        ${row.margin.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="#8FC7FA" fontSize="13px">
                        ${row.funding.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

      {/* Placeholder for other tabs */}
      {tabValue === 1 && (
        <Typography
          color="#666"
          fontSize="14px"
          fontFamily='"SF Pro", sans-serif'
        >
          No active transactions
        </Typography>
      )}
      {tabValue === 2 && (
        <Typography
          color="#666"
          fontSize="14px"
          fontFamily='"SF Pro", sans-serif'
        >
          No spot balances
        </Typography>
      )}
    </Box>
  );
}
