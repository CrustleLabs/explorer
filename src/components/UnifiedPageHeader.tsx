import React from "react";
import {Stack, Typography, Box} from "@mui/material";
import HeaderSearch from "../pages/layout/Search/Index";
import {usePageMetadata} from "./hooks/usePageMetadata";

type UnifiedPageHeaderProps = {
  title: string;
  // Optional: override the displayed H1 if it differs from the breadcrumb title,
  // though usually they are the same in this design.
  displayTitle?: string;
  metaTitle?: string;
};

export default function UnifiedPageHeader({
  title,
  displayTitle,
  metaTitle,
}: UnifiedPageHeaderProps) {
  usePageMetadata({title: metaTitle || title});

  const finalDisplayTitle = displayTitle || title;

  return (
    <Stack direction="column" spacing={2} marginX={1}>
      <Stack direction="row" spacing={1} alignItems="center" marginBottom={1}>
        <Typography
          variant="body2"
          color="#999"
          fontFamily='"SF Pro", sans-serif'
        >
          Intention Explorer
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
          {title}
        </Typography>
      </Stack>
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
        {finalDisplayTitle}
      </Typography>
      <Box sx={{marginTop: 2, marginBottom: 4, width: "100%"}}>
        <HeaderSearch />
      </Box>
    </Stack>
  );
}
