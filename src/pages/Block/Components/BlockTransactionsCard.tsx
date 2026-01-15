import React from "react";
import {Box, Stack, Typography} from "@mui/material";
import {Block} from "@aptos-labs/ts-sdk";
import TransactionsTable, {
  PREVIEW_COLUMNS,
} from "../../Transactions/TransactionsTable";
import {Types} from "aptos";
import EmptyTabContent from "../../../components/IndividualPageContent/EmptyTabContent";

export default function BlockTransactionsCard({data}: {data: Block}) {
  const transactions = data.transactions ?? [];

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
            style={{width: 24, height: 24}}
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

      {/* Table */}
      {transactions.length === 0 ? (
        <EmptyTabContent />
      ) : (
        <TransactionsTable
          transactions={transactions as Types.Transaction[]}
          columns={PREVIEW_COLUMNS}
        />
      )}
    </Box>
  );
}
