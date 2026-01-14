import React, {useState} from "react";
import {Box, Stack, Tooltip, Typography} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {Link} from "../../../../routing";

export default function AccountAddressPill({address}: {address: string}) {
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopyTooltipOpen(true);
    setTimeout(() => setCopyTooltipOpen(false), 2000);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        backgroundColor: "rgba(102, 75, 158, 0.5)",
        border: "1px solid rgba(182, 146, 244, 0.24)",
        borderRadius: "40px",
        padding: "10px 16px",
        width: "fit-content",
        maxWidth: "100%",
      }}
    >
      <Link
        to={`/account/${address}`}
        style={{textDecoration: "none", color: "inherit", overflow: "hidden"}}
      >
        <Typography
          sx={{
            color: "#fff",
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: '"SF Pro", monospace',
            letterSpacing: "0.01em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {address}
        </Typography>
      </Link>
      <Tooltip
        title="Copied"
        open={copyTooltipOpen}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        placement="right"
      >
        <Box
          component="span"
          onClick={handleCopy}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            color: "rgba(255, 255, 255, 0.6)",
            "&:hover": {
              color: "#FFFFFF",
            },
          }}
        >
          <ContentCopyIcon sx={{fontSize: 16}} />
        </Box>
      </Tooltip>
    </Stack>
  );
}
