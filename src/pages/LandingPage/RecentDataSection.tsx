import {Grid} from "@mui/material";
import RecentBlocks from "./RecentBlocks";
import RecentTransactions from "./RecentTransactions";

export default function RecentDataSection() {
  return (
    <Grid container spacing={3}>
      <Grid size={{xs: 12, md: 6}}>
        <RecentBlocks />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <RecentTransactions />
      </Grid>
    </Grid>
  );
}
