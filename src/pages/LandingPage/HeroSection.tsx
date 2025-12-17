import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Grid} from "@mui/material";
import ActivityGraph from "./ActivityGraph";

// Gradient title styling
const gradientTitleSx = {
  background:
    "linear-gradient(90deg, #D9CBFB 0%, #EBE3FE 32.24%, #EF9778 62.98%, #EE914C 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 700,
  fontSize: {xs: "32px", md: "48px"},
  lineHeight: 1,
  fontFamily: '"SF Pro", system-ui, -apple-system, sans-serif',
};

// Card container styling
const heroCardSx = {
  backgroundColor: "#16141A",
  borderRadius: "24px",
  border: "0.5px solid rgba(255,255,255,0.06)",
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

// Activity grid colors from Figma
const ACTIVITY_COLORS = [
  "#2C2835", // Darkest
  "#F6F4FE", // Very Light
  "#F0EAFD", // Light Purple-ish
  "#D9CBFB", // Light Purple
  "#CDB9F9", // Medium Purple
  "#B692F4", // Darker Purple
];

export default function HeroSection() {
  return (
    <Box sx={heroCardSx}>
      <Grid container spacing={4} alignItems="center">
        {/* Left Side: Title, Info, Legend */}
        <Grid size={{xs: 12, md: 5}}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              height: "100%",
            }}
          >
            <Box>
              <Typography variant="h1" sx={gradientTitleSx}>
                Settle Explorer
              </Typography>

              <Typography
                variant="body1"
                sx={{color: "#999", mt: 1, fontSize: "16px"}}
              >
                Real-time visualization of network activity
              </Typography>

              <Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 2}}>
                <Typography variant="body2" sx={{color: "#999"}}>
                  Live Block Activity:
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#d9cbfb",
                    px: 1,
                    py: 0.25,
                    borderRadius: "49px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "700",
                    }}
                  >
                    99 ms
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Spacer to push legend down if height allows, or just margin */}
            <Box sx={{flexGrow: 1, minHeight: "40px"}} />

            {/* Legend */}
            <Box>
              <Box sx={{display: "flex", gap: 1, mb: 1}}>
                {ACTIVITY_COLORS.map((color, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "6px",
                      backgroundColor: color,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                ))}
              </Box>
              <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                <Typography variant="body2" sx={{color: "#999"}}>
                  Low
                </Typography>
                <Typography variant="body2" sx={{color: "#999"}}>
                  &gt;
                </Typography>
                <Typography variant="body2" sx={{color: "#fff"}}>
                  High
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Side: Visualization Grid */}
        <Grid size={{xs: 12, md: 7}}>
          <ActivityGraph />
        </Grid>
      </Grid>
    </Box>
  );
}
