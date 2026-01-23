import {Box, Grid} from "@mui/material";
import RecentBlocks from "./RecentBlocks";
import RecentTransactions from "./RecentTransactions";

// Fixed height for the cards
const CARD_HEIGHT = 580;

export default function RecentDataSection() {
  return (
    <Grid container spacing={3}>
      <Grid size={{xs: 12, md: 6}}>
        <Box sx={{height: CARD_HEIGHT}}>
          <RecentBlocks />
        </Box>
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <Box sx={{height: CARD_HEIGHT}}>
          <RecentTransactions />
        </Box>
      </Grid>
    </Grid>
  );
}
