import Button from "@mui/material/Button";
import {useState} from "react";
import Box from "@mui/material/Box";
import * as RRD from "react-router-dom";
import {Stack, Typography} from "@mui/material";
import HeaderSearch from "../layout/Search/Index";
import TransactionsTable from "../Transactions/TransactionsTable";
import TransactionsPreview, {PREVIEW_COLUMNS} from "./TransactionsPreview";
import {useAugmentToWithGlobalSearchParams} from "../../routing";
import {SkeletonTable} from "../../components/SkeletonBlock";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {useGetAccountTransactions} from "../../api/hooks/useGetAccountTransactions";

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
  const [isHovered, setIsHovered] = useState(false);
  const {account} = useWallet();
  const {data: transactions, isLoading} = useGetAccountTransactions(
    account?.address?.toString(),
    undefined,
    PREVIEW_TRANSACTIONS_COUNT,
    {refetchInterval: isHovered ? 0 : 5000},
  );
  const augmentTo = useAugmentToWithGlobalSearchParams();

  // If no wallet connected, show global transactions
  if (!account?.address) {
    return <TransactionsPreview />;
  }

  // Initial loading state (only for first load)
  if (isLoading) {
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
          <SkeletonTable rowCount={10} />
        </Stack>
      </Box>
    );
  }

  // If we have no transactions (and not loading), fallback to global
  if (!transactions || transactions.length === 0) {
    return <TransactionsPreview />;
  }

  // Show user transactions
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
          <TransactionsTable
            transactions={transactions}
            columns={PREVIEW_COLUMNS}
          />
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
