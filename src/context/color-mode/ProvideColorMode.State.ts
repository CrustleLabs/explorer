import {useMemo, useState} from "react";
import {createTheme, responsiveFontSizes} from "@mui/material";
import getDesignTokens from "../../themes/theme";

export interface ColorModeContext {
  toggleColorMode: () => void;
  mode: "light" | "dark";
}

type Mode = "light" | "dark";

const useProvideColorMode = () => {
  // Permanently set to dark mode as requested
  const [mode] = useState<Mode>("dark");

  // Removed auto-detect and toggle logic to enforce dark mode
  const toggleColorMode = () => {
    // No-op
  };

  let theme = useMemo(
    () => responsiveFontSizes(createTheme(getDesignTokens(mode))),
    [mode],
  );

  theme = createTheme(theme, {
    typography: {
      h1: {
        fontSize: "2.5rem",
        [theme.breakpoints.up("sm")]: {
          fontSize: "2.5rem",
        },
        [theme.breakpoints.up("md")]: {
          fontSize: "3rem",
        },
        [theme.breakpoints.up("lg")]: {
          fontSize: "3.5rem",
        },
      },
    },
  });

  return {toggleColorMode, theme, mode};
};

export default useProvideColorMode;
