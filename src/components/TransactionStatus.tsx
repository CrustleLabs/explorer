import React from "react";
import {Box, Stack, Typography} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";

type TransactionStatusProps = {
  success: boolean;
};

export function TransactionStatus({success}: TransactionStatusProps) {
  return success ? (
    <Stack
      direction="row"
      spacing={1}
      paddingX={1.5}
      paddingY={0.5}
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: "rgba(3, 168, 129, 0.12)",
        border: "1px solid rgba(3, 168, 129, 0.2)",
        borderRadius: "100px", // Pill shape
        width: "fit-content",
      }}
    >
      <CheckCircleIcon sx={{color: "#03A881", fontSize: 16}} />
      <Typography
        variant="body2"
        sx={{
          color: "#03A881",
          fontWeight: 600,
          fontSize: "12px",
          fontFamily: '"SF Pro", sans-serif',
        }}
      >
        Success
      </Typography>
    </Stack>
  ) : (
    <Stack
      direction="row"
      spacing={1}
      paddingX={1.5}
      paddingY={0.5}
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: "rgba(220, 41, 113, 0.12)",
        border: "1px solid rgba(220, 41, 113, 0.2)",
        borderRadius: "100px", // Pill shape
        width: "fit-content",
      }}
    >
      <ErrorOutlinedIcon sx={{color: "#DC2971", fontSize: 16}} />
      <Typography
        variant="body2"
        sx={{
          color: "#DC2971",
          fontWeight: 600,
          fontSize: "12px",
          fontFamily: '"SF Pro", sans-serif',
        }}
      >
        Failed
      </Typography>
    </Stack>
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
