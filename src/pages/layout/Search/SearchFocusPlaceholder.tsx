import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchFocusPlaceholder() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 6,
        px: 2,
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "rgba(205,185,249,0.16)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SearchIcon sx={{color: "#fff", fontSize: 24}} />
        </Box>
        <Stack spacing={1}>
          <Typography
            sx={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: '"SF Pro", system-ui, sans-serif',
            }}
          >
            Start typing to see results
          </Typography>
          <Typography
            sx={{
              color: "#999",
              fontSize: "12px",
              fontFamily: '"SF Pro", system-ui, sans-serif',
              maxWidth: "292px",
              lineHeight: 1.4,
            }}
          >
            Search by Account Name or Address / Txn Hash or Version / Block
            Height or Version
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
