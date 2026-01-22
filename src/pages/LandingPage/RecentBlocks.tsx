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
  backgroundColor: "#16141A",
  borderRadius: "24px",
  border: "0.5px solid rgba(255,255,255,0.06)",
  p: 3,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  height: "100%",
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
  fontSize: "12px",
  fontFamily: '"SF Pro", sans-serif',
  textTransform: "uppercase" as const,
  py: 1.5,
};

// Table row styling
const rowSx = {
  display: "grid",
  gridTemplateColumns: "1fr 0.8fr 0.6fr 1.2fr",
  gap: 2,
  py: 1.5,
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  "&:last-child": {
    borderBottom: "none",
  },
};

// Cell styling
const cellSx = {
  color: "#fff",
  fontSize: "13px",
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

  return (
    <Box
      sx={cardSx}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          fontSize: "20px",
          fontWeight: 600,
          fontFamily: '"SF Pro", sans-serif',
        }}
      >
        Recent Blocks
      </Typography>

      {/* Table Header */}
      <Box sx={rowSx}>
        <Typography sx={headerCellSx}>Height</Typography>
        <Typography sx={headerCellSx}>Time</Typography>
        <Typography sx={headerCellSx}>Txs</Typography>
        <Typography sx={headerCellSx}>Proposer</Typography>
      </Box>

      {/* Table Body */}
      <Box sx={{flex: 1, overflowY: "auto"}}>
        {isLoading || !blocks
          ? // Skeleton loading
            Array.from({length: PREVIEW_LIMIT}).map((_, i) => (
              <Box key={i} sx={rowSx}>
                <Skeleton variant="text" width={80} />
                <Skeleton variant="text" width={40} />
                <Skeleton variant="text" width={40} />
                <Skeleton variant="text" width={100} />
              </Box>
            ))
          : blocks.map((block: BlockInfo, index: number) => {
              const txCount =
                parseInt(block.last_version) -
                parseInt(block.first_version) +
                1;
              return (
                <Box key={index} sx={rowSx}>
                  <Box sx={cellSx}>
                    <RRD.Link
                      to={augmentTo(`/block/${block.block_height}`)}
                      style={{color: "#8FC7FA", textDecoration: "none"}}
                    >
                      {parseInt(block.block_height).toLocaleString()}
                    </RRD.Link>
                  </Box>
                  <Typography sx={cellSx}>
                    {formatTimeAgo(block.block_timestamp)}
                  </Typography>
                  <Typography sx={cellSx}>
                    {txCount.toLocaleString()}
                  </Typography>
                  <Box sx={cellSx}>
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
      <Box sx={{display: "flex", justifyContent: "center", pt: 1}}>
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
