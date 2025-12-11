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

// Primary Palette - Pink (#EC80D3)
export const primary = {
  50: "#fef5fb",
  100: "#fde8f6",
  200: "#fbd0ed",
  300: "#f7a8de",
  400: "#EC80D3", // Main primary color
  500: "#e05cc4",
  600: "#c93dab",
  700: "#a82d8b",
  800: "#8a2772",
  900: "#72255f",
};

// Secondary colors from palette
export const secondary = {
  mint: "#DCF9D6", // Light green
  cream: "#FFF4AE", // Light yellow
  olive: "#E1E4C4", // Beige/olive
};

export const aptosColor = primary[500];
export const negativeColor: string = "#F97373";
export const warningColor: string = "#f1c232";

// code block colors - adjusted to match pink theme
export const codeBlockColor: string = "rgba(236,128,211,0.1)";
export const codeBlockColorClickableOnHover: string = "rgba(236,128,211,0.2)";
// use rgb for codeblock in modal otherwise it will be transparent and not very visible
export const codeBlockColorRgbLight: string = "#F8E8F4";
export const codeBlockColorRgbDark: string = "#2D1F2A";
