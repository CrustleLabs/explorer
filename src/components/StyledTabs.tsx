import React from "react";
import {Tabs, TabsProps} from "@mui/material";

interface StyledTabsProps extends TabsProps {
  children: React.ReactNode;
}

export default function StyledTabs({children, ...props}: StyledTabsProps) {
  return (
    <Tabs
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        backgroundColor: "#16141A",
        border: "0.5px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "68px",
        padding: "6px",
        display: "inline-flex",
        minHeight: "auto",
        "& .MuiTabs-indicator": {
          display: "none",
        },
        "& .MuiTabs-scroller": {
          display: "flex",
        },
        "& .MuiTabs-flexContainer": {
          gap: "8px", // Added small gap between items
        },
      }}
      {...props}
    >
      {children}
    </Tabs>
  );
}
