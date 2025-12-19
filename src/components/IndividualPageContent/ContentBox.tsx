import * as React from "react";
import {Box, BoxProps, Stack, useTheme} from "@mui/material";

interface ContentBoxProps extends BoxProps {
  children: React.ReactNode;
}

export default function ContentBox({children, ...props}: ContentBoxProps) {
  const theme = useTheme();
  // TODO: unify colors for the new transaction page

  return (
    <Box
      padding={3}
      marginTop={3}
      sx={{
        backgroundColor: "#16141A",
        borderRadius: "24px",
        border: "0.5px solid rgba(255,255,255,0.06)",
        // Keep light mode support if needed, but prioritize the requested dark style
        ...(theme.palette.mode === "light" && {
          backgroundColor: "#fff",
          border: "1px solid rgba(0,0,0,0.1)",
        }),
      }}
      {...props}
    >
      <Stack direction="column" spacing={4}>
        {children}
      </Stack>
    </Box>
  );
}
