import {Box, Grid} from "@mui/material";
import RecentBlocks from "./RecentBlocks";
import RecentTransactions from "./RecentTransactions";
import {Types} from "aptos";

interface RecentDataSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[];
  transactions: Types.Transaction[];
}

// Fixed height for the cards
const CARD_HEIGHT = 580;

export default function RecentDataSection({
  blocks,
  transactions,
}: RecentDataSectionProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={{xs: 12, md: 6}}>
        <Box sx={{height: CARD_HEIGHT}}>
          <RecentBlocks blocks={blocks} />
        </Box>
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <Box sx={{height: CARD_HEIGHT}}>
          <RecentTransactions transactions={transactions} />
        </Box>
      </Grid>
    </Grid>
  );
}
