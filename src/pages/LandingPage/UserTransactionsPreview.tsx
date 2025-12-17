import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import * as RRD from "react-router-dom";
import {Stack, Typography} from "@mui/material";
import HeaderSearch from "../layout/Search/Index";
import {UserTransactionsTable} from "../Transactions/TransactionsTable";
import useGetUserTransactionVersions from "../../api/hooks/useGetUserTransactionVersions";
import TransactionsPreview from "./TransactionsPreview";
import {useAugmentToWithGlobalSearchParams} from "../../routing";
import {useGetTransaction} from "../../api/hooks/useGetTransaction";
import {Types} from "aptos";
import {ensureMillisecondTimestamp} from "../utils";

const PREVIEW_TRANSACTIONS_COUNT = 10;

// Card container styling matching Figma
const transactionsCardSx = {
  backgroundColor: "#16141A",
  borderRadius: "24px",
  border: "0.5px solid rgba(255,255,255,0.06)",
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

// View all link styling
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

export default function UserTransactionsPreview() {
  const versions = useGetUserTransactionVersions(PREVIEW_TRANSACTIONS_COUNT);
  const latestVersion = useGetTransaction(
    versions[0] ? versions[0].toString() : "1",
  );
  const augmentTo = useAugmentToWithGlobalSearchParams();

  // When there's no data, show the normal preview component
  if (!latestVersion?.data || versions.length === 0)
    return <TransactionsPreview />;

  // When there is data, show the user transactions table, if it's up to date, otherwise fallback to the preview component
  if (latestVersion.isLoading || latestVersion.isError) {
    return <TransactionsPreview />;
  }

  const latestTransaction =
    latestVersion.data as Types.Transaction_UserTransaction;
  const timeBehind =
    BigInt(Date.now().valueOf()) -
    ensureMillisecondTimestamp(latestTransaction.timestamp);
  if (timeBehind > 1000n * 60n * 5n) {
    // If the latest transaction is more than 5 minutes old, show all transactions
    return <TransactionsPreview />;
  }

  return (
    <Box sx={transactionsCardSx}>
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
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "36px",
              fontFamily: '"SF Pro", system-ui, sans-serif',
              whiteSpace: "nowrap",
            }}
          >
            Recent Transactions
          </Typography>
          <Box sx={{width: {xs: "100%", md: "400px"}}}>
            <HeaderSearch />
          </Box>
        </Box>
        <Box sx={{width: "auto", overflowX: "auto"}}>
          <UserTransactionsTable versions={versions} />
        </Box>
        <Box sx={{display: "flex", justifyContent: "center", pt: 2, pb: 2}}>
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
