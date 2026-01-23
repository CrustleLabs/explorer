// Grey Palette - with slight pink tint to match theme
export const grey = {
  50: "#fdfafc",
  100: "#f8f4f6",
  200: "#ece6ea",
  300: "#ddd6db",
  400: "#b5a8b2",
  450: "#9a8d97",
  500: "#5a4f56",
  600: "#3d343a",
  700: "#2d252b",
  800: "#201a1e",
  900: "#151114",
};

// Primary Palette - Intention Brand Purple
export const primary = {
  50: "#F6F4FE",
  100: "#F0EAFD",
  200: "#D9CBFB",
  300: "#CDB9F9", // Main brand color
  400: "#B692F4",
  500: "#9E64EE",
  600: "#8347D9",
  700: "#6B32B8",
  800: "#542897",
  900: "#401F76",
};

// Secondary colors from palette
export const secondary = {
  mint: "#DCF9D6", // Light green
  cream: "#FFF4AE", // Light yellow
  olive: "#E1E4C4", // Beige/olive
};

// Transaction status colors from Figma
export const transactionColors = {
  success: "#03A881",
  successBg: "rgba(3,168,129,0.12)",
  fail: "#DC2971",
  failBg: "rgba(220,41,113,0.12)",
};

export const aptosColor = primary[500];
export const negativeColor: string = "#DC2971";
export const warningColor: string = "#f1c232";

// code block colors - adjusted to match purple theme
export const codeBlockColor: string = "rgba(157,100,238,0.1)";
export const codeBlockColorClickableOnHover: string = "rgba(157,100,238,0.2)";
// use rgb for codeblock in modal otherwise it will be transparent and not very visible
export const codeBlockColorRgbLight: string = "#F0EAFD";
export const codeBlockColorRgbDark: string = "#1E1A24";
