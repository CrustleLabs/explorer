import {Box} from "@mui/material";
import React from "react";
import {Block} from "@aptos-labs/ts-sdk";
import TransactionBreakdown from "../Components/TransactionBreakdown";

type OverviewTabProps = {
  data?: Block;
  isLoading?: boolean;
};

export default function OverviewTab({data, isLoading}: OverviewTabProps) {
  return (
    <Box
      sx={{
        backgroundColor: "#16141A",
        borderRadius: "24px",
        border: "0.5px solid rgba(255,255,255,0.12)",
        p: 3,
      }}
    >
      <TransactionBreakdown data={data} isLoading={isLoading} />
    </Box>
  );
}
