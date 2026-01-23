import React from "react";
import {Box, Typography} from "@mui/material";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";

type TransactionStatusProps = {
  success: boolean;
};

export function TransactionStatus({success}: TransactionStatusProps) {
  return success ? (
    <Typography
      sx={{
        color: "#03A881",
        fontSize: "14px",
        fontWeight: 400,
        fontStyle: "normal",
        fontFamily: '"SF Pro", sans-serif',
        lineHeight: "18px",
        px: "8px", // Increased padding slightly for better look
        py: "2px",
        borderRadius: "37px",
        border: "0.5px solid rgba(3, 168, 129, 0.3)",
        backgroundColor: "rgba(3, 168, 129, 0.08)",
        width: "fit-content",
      }}
    >
      Success
    </Typography>
  ) : (
    <Typography
      sx={{
        color: "#DC2971",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        fontFamily: '"SF Pro", sans-serif',
        lineHeight: "18px",
        px: "8px",
        py: "2px",
        borderRadius: "37px",
        border: "0.5px solid rgba(220, 41, 113, 0.3)",
        backgroundColor: "rgba(220, 41, 113, 0.08)",
        width: "fit-content",
      }}
    >
      Fail
    </Typography>
  );
}

export function TableTransactionStatus({success}: TransactionStatusProps) {
  return success ? null : (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <PriorityHighOutlinedIcon
        sx={{fontSize: "inherit"}}
        color="error"
        titleAccess="Failed to Execute"
      />
    </Box>
  );
}
