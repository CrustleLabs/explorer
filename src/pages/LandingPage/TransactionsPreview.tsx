import React, {useState} from "react";
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import Button from "@mui/material/Button";
import {Types} from "aptos";
import {getTransactions} from "../../api";
import {useGlobalState} from "../../global-config/GlobalConfig";
import Box from "@mui/material/Box";
import * as RRD from "react-router-dom";
import {Stack, Typography} from "@mui/material";
import TransactionsTable, {
  TransactionColumn,
} from "../Transactions/TransactionsTable";
import {useAugmentToWithGlobalSearchParams} from "../../routing";
import HeaderSearch from "../layout/Search/Index";
import {SkeletonTable} from "../../components/SkeletonBlock";

const PREVIEW_LIMIT = 10;

// Card container styling matching Figma (same as UserTransactionsPreview)
const transactionsCardSx = {
  backgroundColor: "#16141A",
  borderRadius: "24px",
  border: "0.5px solid rgba(255,255,255,0.06)",
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

// View all link styling (consistent with UserTransactionsPreview)
const viewAllLinkSx = {
  color: "#CDB9F9",
  fontSize: "16px",
  fontFamily: '"SF Pro", system-ui, sans-serif',
  textDecoration: "none",
  cursor: "pointer",
  transition: "opacity 0.2s",
  "&:hover": {
    opacity: 0.8,
  },
  textTransform: "none",
};

export const PREVIEW_COLUMNS: TransactionColumn[] = [
  "version",
  "type",
  "status",
  "sender",
  "actionsDetails",
  "timestamp",
];

function TransactionContent({
  data,
  isLoading,
}: UseQueryResult<Array<Types.Transaction>> & {isLoading?: boolean}) {
  if (isLoading || !data) {
    return <SkeletonTable rowCount={10} />;
  }

  return <TransactionsTable transactions={data} columns={PREVIEW_COLUMNS} />;
}

export default function TransactionsPreview() {
  const [isHovered, setIsHovered] = useState(false);
  const [state] = useGlobalState();
  const limit = PREVIEW_LIMIT;
  const result = useQuery({
    queryKey: ["transactionsPreview", {limit}, state.network_value],
    queryFn: () => getTransactions({limit}, state.aptos_client),
    refetchInterval: isHovered ? 0 : 5000,
  });
  const augmentTo = useAugmentToWithGlobalSearchParams();

  return (
    <Box
      sx={transactionsCardSx}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: {xs: "column", md: "row"},
            justifyContent: "space-between",
            alignItems: {xs: "flex-start", md: "center"},
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "48px",
              fontFamily: '"SF Pro", system-ui, sans-serif',
              whiteSpace: "nowrap",
            }}
          >
            All Transactions
          </Typography>
          <Box sx={{width: {xs: "100%", md: "400px"}}}>
            <HeaderSearch />
          </Box>
        </Box>

        <Box sx={{width: "auto", overflowX: "auto"}}>
          <TransactionContent {...result} />
        </Box>

        <Box sx={{display: "flex", justifyContent: "center"}}>
          <Button
            component={RRD.Link}
            to={augmentTo("/transactions")}
            sx={viewAllLinkSx}
          >
            {"< View all transactions >"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
