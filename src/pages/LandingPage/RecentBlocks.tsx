import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Box from "@mui/material/Box";
import {Typography, Skeleton} from "@mui/material";
import * as RRD from "react-router-dom";
import Button from "@mui/material/Button";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {useAugmentToWithGlobalSearchParams} from "../../routing";
import HashButton, {HashType} from "../../components/HashButton";

const PREVIEW_LIMIT = 10;

// Card container styling matching Figma
const cardSx = {
  backgroundColor: "rgba(31, 28, 37, 0.6)",
  borderRadius: "24px",
  border: "0.5px solid rgba(255,255,255,0.12)",
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
  py: "10px",
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

type BlockInfo = {
  block_height: string;
  block_timestamp: string;
  first_version: string;
  last_version: string;
};

function formatTimeAgo(timestamp: string): string {
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

export default function RecentBlocks() {
  const [isHovered, setIsHovered] = useState(false);
  const [state] = useGlobalState();
  const augmentTo = useAugmentToWithGlobalSearchParams();
  const navigate = RRD.useNavigate();

  const {data: blocks, isLoading} = useQuery({
    queryKey: ["recentBlocks", state.network_value],
    queryFn: async () => {
      // Get ledger info first to get latest block height
      const ledgerInfo = await state.aptos_client.getLedgerInfo();
      const latestHeight = parseInt(ledgerInfo.block_height);

      // Fetch recent blocks
      const blockPromises = [];
      for (let i = 0; i < PREVIEW_LIMIT; i++) {
        const height = latestHeight - i;
        if (height >= 0) {
          blockPromises.push(
            state.aptos_client.getBlockByHeight(height, false),
          );
        }
      }
      return Promise.all(blockPromises);
    },
    refetchInterval: isHovered ? 0 : 5000,
  });

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
        sx={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1, // 8px gap between rows
          px: 1.5, // 12px padding
          // Custom Scrollbar
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
            background: "#3C3C41", // Darker simplified thumb
            borderRadius: "10px",
            border:
              "4px solid rgba(0,0,0,0)" /* Creates 4px spacing/padding around thumb */,
            backgroundClip: "padding-box",
            "&:hover": {
              background: "#4C4C51",
              border: "4px solid rgba(0,0,0,0)",
              backgroundClip: "padding-box",
            },
          },
        }}
      >
        {isLoading || !blocks
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
          : blocks.map((block: BlockInfo, index: number) => {
              const txCount =
                parseInt(block.last_version) -
                parseInt(block.first_version) +
                1;
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
                    {formatTimeAgo(block.block_timestamp)}
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
                      hash="0x6443...39ee"
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
