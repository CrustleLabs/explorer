import * as React from "react";
import {Tab, TabProps} from "@mui/material";

interface StyledTabProps extends TabProps {
  isFirst: boolean;
  isLast: boolean;
  secondary?: boolean; // some page has multiple levels of tabs, the style would be different.
}

export default function StyledTab({
  isFirst,
  isLast,
  secondary,
  ...props
}: StyledTabProps) {
  // Use unused props to suppress lint errors if they are needed for API compatibility but not used in logic
  void isFirst;
  void isLast;
  void secondary;

  return (
    <Tab
      sx={{
        minHeight: "44px", // Adjusted to fit container
        textTransform: "none",
        fontSize: "18px",
        fontFamily: '"SF Pro", sans-serif',
        fontWeight: 400,
        lineHeight: "22px",
        paddingX: "24px",
        paddingY: "10px",
        color: "#999",
        minWidth: "172px",
        borderRadius: "120px",
        marginRight: 0,
        zIndex: 1,
        transition: "all 0.2s ease-in-out",
        "&.Mui-selected": {
          color: "#CDB9F9",
          backgroundColor: "rgba(205, 185, 249, 0.12)",
          border: "0.5px solid rgba(255, 255, 255, 0.06)",
          fontSize: "20px",
          fontWeight: 700,
          lineHeight: "24px",
        },
        "&:hover": {
          color: "#fff",
          backgroundColor: "rgba(255,255,255,0.05)",
        },
        flexGrow: {xs: 1, md: 0},
      }}
      iconPosition="start"
      disableRipple
      {...props}
    />
  );
}
