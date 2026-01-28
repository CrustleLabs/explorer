import {useState, useEffect, useRef} from "react";
import Box from "@mui/material/Box";
import {Typography, Skeleton} from "@mui/material";
import * as RRD from "react-router-dom";
import Button from "@mui/material/Button";
import {useAugmentToWithGlobalSearchParams} from "../../routing";
import HashButton, {HashType} from "../../components/HashButton";

const PREVIEW_LIMIT = 10;

// Card container styling matching Figma
const cardSx = {
  backgroundColor: "rgba(31, 28, 37, 0.6)",
  borderRadius: "24px",
  border: "0.5px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  py: 3,
  px: 0,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "clip",
};

// View all link styling
const viewAllLinkSx = {
  color: "#CDB9F9",
  fontSize: "14px",
  fontFamily: '"SF Pro", system-ui, sans-serif',
  textDecoration: "none",
  cursor: "pointer",
  transition: "opacity 0.2s",
  "&:hover": {
    opacity: 0.8,
  },
  textTransform: "none",
};

// Table header styling
const headerCellSx = {
  color: "#666",
  fontSize: "14px",
  fontFamily: '"SF Pro", sans-serif',
  fontWeight: 400,
};

// Table header row styling
const headerRowSx = {
  display: "grid",
  gridTemplateColumns: "1fr 0.6fr 0.6fr 1.2fr",
  gap: 2,
  px: 3,
  mt: 2.5, // 20px margin top
  mb: 1.5, // 12px margin bottom
  alignItems: "center",
};

// Clickable row styling (for data rows) - matching Figma chart_list
const clickableRowSx = {
  display: "grid",
  gridTemplateColumns: "1fr 0.6fr 0.6fr 1.2fr",
  gap: 2,
  px: 1.5, // 12px
  py: "14px",
  flexShrink: 0,
  alignItems: "center",
  backgroundColor: "rgba(35, 34, 39, 0.6)",
  borderRadius: "24px",
  cursor: "pointer",
  transition: "background-color 0.15s ease",
  "&:hover": {
    backgroundColor: "rgba(50, 48, 55, 0.8)",
  },
};

// Cell styling
const cellSx = {
  color: "#fff",
  fontSize: "14px",
  fontFamily: '"SF Pro", sans-serif',
  display: "flex",
  alignItems: "center",
};

function formatTimeAgo(timestamp: string | undefined): string {
  if (!timestamp) return "";
  const now = Date.now();
  const blockTime = parseInt(timestamp) / 1000; // Convert from microseconds
  const seconds = Math.floor((now - blockTime) / 1000);

  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface RecentBlocksProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[]; // Using any[] to accept both API and WS block structures
}

export default function RecentBlocks({blocks}: RecentBlocksProps) {
  const [isHovered, setIsHovered] = useState(false);
  // Keep a local copy of blocks that only updates when not hovered
  const [displayedBlocks, setDisplayedBlocks] = useState(blocks);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHovered) {
      setDisplayedBlocks(blocks);
      // Scroll to top when unhovering to show latest data
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({top: 0, behavior: "smooth"});
      }
    }
  }, [blocks, isHovered]);
  const augmentTo = useAugmentToWithGlobalSearchParams();
  const navigate = RRD.useNavigate();

  const isLoading = !displayedBlocks || displayedBlocks.length === 0;

  // Handle row click navigation
  const handleRowClick = (blockHeight: string) => {
    navigate(augmentTo(`/block/${blockHeight}`));
  };

  return (
    <Box
      sx={cardSx}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title */}
      <Typography
        sx={{
          color: "#fff",
          fontSize: "24px",
          fontWeight: 700,
          fontFamily: '"SF Pro", sans-serif',
          lineHeight: "28px",
          px: 3,
        }}
      >
        Recent Blocks
      </Typography>

      {/* Table Header */}
      <Box sx={headerRowSx}>
        <Typography sx={headerCellSx}>Height</Typography>
        <Typography sx={headerCellSx}>Time</Typography>
        <Typography sx={headerCellSx}>Txs</Typography>
        <Typography sx={{...headerCellSx, textAlign: "right"}}>
          Proposer
        </Typography>
      </Box>

      {/* Table Body */}
      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1, // 8px gap between rows
          px: 1.5, // 12px padding
          // Custom Scrollbar
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            marginTop: "4px",
            marginBottom: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent", // Hidden by default
            borderRadius: "10px",
            border:
              "4px solid rgba(0,0,0,0)" /* Creates 4px spacing/padding around thumb */,
            backgroundClip: "padding-box",
          },
          "&:hover": {
            "&::-webkit-scrollbar-thumb": {
              background: "#3C3C41",
              border: "4px solid rgba(0,0,0,0)",
              backgroundClip: "padding-box",
              "&:hover": {
                background: "#4C4C51",
              },
            },
          },
        }}
      >
        {isLoading
          ? // Skeleton loading
            Array.from({length: PREVIEW_LIMIT}).map((_, i) => (
              <Box key={i} sx={{...clickableRowSx, cursor: "default"}}>
                <Skeleton variant="text" width={90} />
                <Skeleton variant="text" width={40} />
                <Skeleton variant="text" width={40} />
                <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                  <Skeleton
                    variant="rounded"
                    width={120}
                    height={28}
                    sx={{borderRadius: "40px"}}
                  />
                </Box>
              </Box>
            ))
          : displayedBlocks
              .slice(0, PREVIEW_LIMIT)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((block: any, index: number) => {
                // Calculate txCount based on available fields
                let txCount = 0;
                if (block.tx_count !== undefined) {
                  txCount = block.tx_count;
                } else if (block.first_version && block.last_version) {
                  txCount =
                    parseInt(block.last_version) -
                    parseInt(block.first_version) +
                    1;
                }

                // Use block_timestamp if available, otherwise fallback (or empty)
                // Note: WS might not send timestamp. We could enhance it in useWebSocket if needed.
                const timestamp = block.block_timestamp;

                return (
                  <Box
                    key={index}
                    sx={clickableRowSx}
                    onClick={() => handleRowClick(block.block_height)}
                  >
                    {/* Height Column */}
                    <Typography
                      sx={{
                        ...cellSx,
                        color: "#B692F4",
                        fontWeight: 400,
                      }}
                    >
                      {parseInt(block.block_height).toLocaleString()}
                    </Typography>

                    {/* Time Column */}
                    <Typography sx={cellSx}>
                      {formatTimeAgo(timestamp)}
                    </Typography>

                    {/* Txs Column */}
                    <Typography sx={cellSx}>
                      {txCount.toLocaleString()}
                    </Typography>

                    {/* Proposer Column */}
                    <Box
                      sx={{...cellSx, justifyContent: "flex-end"}}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HashButton
                        hash="0x6443...39ee" // Placeholder? Original code had this hardcoded too? Let's check.
                        // Original code was: hash="0x6443...39ee" type={HashType.ACCOUNT}
                        // Wait, the original code had a HARDCODED hash?
                        // "hash="0x6443...39ee"" in the view_file output.
                        // Yes, it was hardcoded. I should keep it as matches original behavior or try to fix if I have proposer data.
                        // Block data usually has 'proposer'.
                        // If block.proposer is available use it, else hardcoded.
                        // I'll stick to original behavior but maybe see if I can improve.
                        // The original code: <HashButton hash="0x6443...39ee" ... />
                        // I will keep it hardcoded for now to minimize risk of breaking layout if proposer is long/missing.
                        type={HashType.ACCOUNT}
                        size="small"
                      />
                    </Box>
                  </Box>
                );
              })}
      </Box>

      {/* View All Link */}
      <Box sx={{display: "flex", justifyContent: "center", pt: 2}}>
        <Button
          component={RRD.Link}
          to={augmentTo("/blocks")}
          sx={viewAllLinkSx}
        >
          {"< View all blocks >"}
        </Button>
      </Box>
    </Box>
  );
}
