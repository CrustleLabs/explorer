import {Box, Grid, Stack, Typography} from "@mui/material";
import React from "react";
import LatestActivityList from "./LatestActivityList";
import ActivityHeatmap from "./ActivityHeatmap";
import FundFlowDiagram from "./FundFlowDiagram";

export default function RecentActivity({address}: {address: string}) {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(31, 28, 37, 0.6)",
        border: "0.5px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "24px",
        p: 4,
      }}
    >
      {/* Header */}
      <Stack spacing={0.5} mb={4}>
        <Typography
          sx={{
            color: "#fff",
            fontSize: "20px",
            fontWeight: 700,
            fontFamily: '"SF Pro", sans-serif',
          }}
        >
          Recent Activity
        </Typography>
        <Typography
          sx={{
            color: "#666",
            fontSize: "12px",
            fontFamily: '"SF Pro", sans-serif',
          }}
        >
          Latest trades and transactions
        </Typography>
      </Stack>

      {/* Content Grid */}
      <Grid container spacing={4}>
        {/* Left: Latest Activity List */}
        <Grid size={{xs: 12, md: 4}}>
          <LatestActivityList address={address} />
        </Grid>

        {/* Right: Heatmap + Fund Flow */}
        <Grid size={{xs: 12, md: 8}}>
          <Stack spacing={4}>
            <ActivityHeatmap address={address} />
            <FundFlowDiagram address={address} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
