import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export function Fallback() {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowSpinner(true), 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  // Always return a container with min-height to prevent layout shift
  // Only show spinner after 250ms delay
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      {showSpinner && <CircularProgress />}
    </Box>
  );
}
