import {Stack, Typography, Box} from "@mui/material";
import React from "react";
import HeaderSearch from "../layout/Search/Index";
import {Types} from "aptos";
import {usePageMetadata} from "../../components/hooks/usePageMetadata";

type TransactionTitleProps = {
  transaction: Types.Transaction;
};

export default function TransactionTitle({transaction}: TransactionTitleProps) {
  let title = `Transaction ${transaction.hash}`;
  if ("version" in transaction) {
    title = ` Transaction ${transaction.version} (${transaction.hash})`;
  }

  usePageMetadata({title});
  return (
    <Stack direction="column" spacing={2} marginX={1}>
      <Stack direction="row" spacing={1} alignItems="center" marginBottom={1}>
        <Typography
          variant="body2"
          color="#999"
          fontFamily='"SF Pro", sans-serif'
        >
          Settle Explorer
        </Typography>
        <Typography
          variant="body2"
          color="#999"
          fontFamily='"SF Pro", sans-serif'
        >
          {"<//>"}
        </Typography>
        <Typography
          variant="body2"
          color="#fff"
          fontFamily='"SF Pro", sans-serif'
        >
          Transactions Details
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontFamily: '"SF Pro", sans-serif',
          fontWeight: 700,
          fontSize: "48px",
        }}
      >
        Transactions Details
      </Typography>
      <Box sx={{marginTop: 2, marginBottom: 4, width: "100%"}}>
        <HeaderSearch />
      </Box>
    </Stack>
  );
}
