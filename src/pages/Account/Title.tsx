import {Box, Stack, Typography} from "@mui/material";
import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {usePageMetadata} from "../../components/hooks/usePageMetadata";

type AccountTitleProps = {
  address: string;
  isMultisig?: boolean;
  isObject?: boolean;
  isDeleted?: boolean;
  isToken?: boolean;
};

export default function AccountTitle({
  address,
  isMultisig = false,
  isToken = false,
  isObject = false,
  isDeleted = false,
}: AccountTitleProps) {
  let title = "Account";
  if (isMultisig) {
    title = "Multisig Account";
  } else if (isToken) {
    if (isDeleted) {
      title = "Deleted Token Object";
    } else {
      title = `Token Object`;
    }
  } else if (isObject) {
    if (isDeleted) {
      title = "Deleted Object";
    } else {
      title = "Object";
    }
  }

  usePageMetadata({title: `${title} ${address}`});

  const handleCopy = () => {
    if (address) {
      // Convert to EVM for copy
      const evmAddr = `0x${address.slice(-40)}`;
      navigator.clipboard.writeText(evmAddr);
    }
  };

  // Convert to EVM for display
  const displayAddress = address ? `0x${address.slice(-40)}` : address;

  return (
    <Stack direction="column" spacing={2} marginX={1}>
      <Typography
        variant="h1"
        sx={{
          fontFamily: '"SF Pro", sans-serif',
          fontWeight: 700,
          fontSize: "48px",
          color: "#fff",
          lineHeight: "1.2",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "100px",
          px: 2,
          py: 1,
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          width: "fit-content",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
          },
        }}
        onClick={handleCopy}
      >
        <Typography
          sx={{
            color: "#fff",
            fontSize: "14px",
            fontFamily: "monospace",
          }}
        >
          {displayAddress}
        </Typography>
        <ContentCopyIcon sx={{fontSize: 16, color: "#999"}} />
      </Box>
    </Stack>
  );
}
