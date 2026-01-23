import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Grid} from "@mui/material";
import ActivityGraph from "./ActivityGraph";
import {Types} from "aptos";
import {useGetMostRecentBlocks} from "../../api/hooks/useGetMostRecentBlocks";
import {useMemo} from "react";

// Gradient title styling
const gradientTitleSx = {
  background:
    "linear-gradient(90deg, #D9CBFB 0%, #EBE3FE 32.24%, #EF9778 62.98%, #EE914C 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 700,
  fontSize: {xs: "28px", sm: "36px", md: "48px"},
  lineHeight: 1.1,
  fontFamily: '"SF Pro", system-ui, -apple-system, sans-serif',
  overflowWrap: "break-word",
  wordBreak: "break-word",
};

// Card container styling
const heroCardSx = {
  backgroundColor: "rgba(31, 28, 37, 0.60)",
  borderRadius: "24px",
  border: "0.5px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
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

function calculateAvgBlockTime(blocks: Types.Block[]): number | null {
  if (!blocks || blocks.length < 2) return null;

  let totalDiff = 0n;
  let count = 0;

  for (let i = 0; i < blocks.length - 1; i++) {
    const current = BigInt(blocks[i].block_timestamp);
    const next = BigInt(blocks[i + 1].block_timestamp);
    // Blocks are usually returned in descending order of height (latest first)
    // So current (index i) should be > next (index i+1)
    // But check the hook implementation/API return order.
    // getRecentBlocks typically returns descending order (latest first).
    // So diff = blocks[i].timestamp - blocks[i+1].timestamp
    const diff = current - next;
    if (diff > 0n) {
      totalDiff += diff;
      count++;
    }
  }

  if (count === 0) return null;

  const avgMicroseconds = Number(totalDiff) / count;
  // Convert to milliseconds
  return Math.round(avgMicroseconds / 1000);
}

export default function HeroSection() {
  const {recentBlocks} = useGetMostRecentBlocks(undefined, 10);

  const blockTimeMs = useMemo(() => {
    return calculateAvgBlockTime(recentBlocks);
  }, [recentBlocks]);

  // Fallback to 99 if calculation fails or no data yet
  const displayTime = blockTimeMs ?? 99;

  return (
    <Box sx={heroCardSx}>
      <Grid container spacing={4} alignItems="flex-start">
        {/* Left Side: Title, Info, Legend */}
        <Grid size={{xs: 12, md: 4}}>
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
                Intention Explorer
              </Typography>

              <Typography
                variant="body1"
                sx={{color: "#999", mt: 3, fontSize: "16px"}}
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
                    {displayTime} ms
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Spacer to push legend down if height allows, or just margin */}
            <Box sx={{flexGrow: 1, minHeight: "40px"}} />

            {/* Legend */}
            <Box>
              <Box sx={{display: "flex", gap: 1, mb: 1.5}}>
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
                <Typography
                  variant="body2"
                  sx={{
                    color: "#999",
                    fontSize: "18px",
                    fontWeight: "400",
                    lineHeight: "18px",
                  }}
                >
                  Low
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#FFF",
                    fontSize: "18px",
                    fontWeight: "400",
                    lineHeight: "18px",
                  }}
                >
                  &gt;
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#D9CBFB",
                    fontSize: "18px",
                    fontWeight: "400",
                    lineHeight: "18px",
                  }}
                >
                  High
                </Typography>
              </Box>
              {/* Dashed line below legend */}
              <Box sx={{mt: 2}}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="142"
                  height="1"
                  viewBox="0 0 142 1"
                  fill="none"
                >
                  <path
                    d="M0 0.25H141.5"
                    stroke="url(#paint0_linear_776_6258)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_776_6258"
                      x1="0"
                      y1="0.75"
                      x2="141.5"
                      y2="0.75"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" stopOpacity="0" />
                      <stop offset="1" stopColor="white" />
                    </linearGradient>
                  </defs>
                </svg>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Side: Visualization Grid */}
        <Grid size={{xs: 12, md: 8}}>
          <Box
            sx={{
              mt: {md: 9},
              width: "100%",
              aspectRatio: "770/235",
              overflow: "hidden",
            }}
          >
            <ActivityGraph sx={{width: "100%", height: "100%"}} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
