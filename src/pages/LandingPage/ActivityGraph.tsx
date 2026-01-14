import Box from "@mui/material/Box";
import {useEffect, useState, useRef} from "react";

import {useGlobalState} from "../../global-config/GlobalConfig";
import {getLedgerInfo} from "../../api";
import {useQuery} from "@tanstack/react-query";
import {SxProps} from "@mui/material";
import ScrollingCodeBackground from "./ScrollingCodeBackground";
import Tooltip, {tooltipClasses, TooltipProps} from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";
import moment from "moment";

// Activity grid colors from Figma
const ACTIVITY_COLORS = [
  "#2C2835", // Darkest
  "#F6F4FE", // Very Light
  "#F0EAFD", // Light Purple-ish
  "#D9CBFB", // Light Purple
  "#CDB9F9", // Medium Purple
  "#B692F4", // Darker Purple
  "#2C2835", // Adding this black color as a placeholder for unknown/empty
];

const MAX_HISTORY_SIZE = 500;

const getActivityColor = (txCount: number) => {
  if (txCount === -1) return ACTIVITY_COLORS[6]; // Placeholder color
  const index = Math.min(Math.floor(txCount / 2), ACTIVITY_COLORS.length - 2); // -1 for index, -1 for last color reservation
  return ACTIVITY_COLORS[index];
};

interface GridItem {
  id: number;
  txCount: number;
  blockHeight?: string;
  timestamp?: string; // microseconds
  status?: string;
  hash?: string;
}

interface ActivityGraphProps {
  sx?: SxProps;
}

const truncateHash = (hash?: string) => {
  if (!hash) return "Unknown";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const CustomTooltip = styled(({className, ...props}: TooltipProps) => (
  <Tooltip {...props} classes={{popper: className}} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#111111", // Darker background
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "13px",
    maxWidth: 260,
    boxShadow: "0px 4px 20px rgba(0,0,0,0.5)",
  },
}));

export default function ActivityGraph({sx}: ActivityGraphProps) {
  const [state] = useGlobalState();
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridDimensions, setGridDimensions] = useState({rows: 9, cols: 0});
  const [gridItems, setGridItems] = useState<GridItem[]>([]);

  // Refs for hover pause logic
  const isHoveringRef = useRef(false);
  const pendingItemsRef = useRef<GridItem[]>([]);

  // Calculate grid dimensions based on container width
  useEffect(() => {
    const calculateDimensions = (width: number, height: number) => {
      // Inner Logic: Available Size / (Dot(16) + Gap(3))
      // We increase the buffer to 16px to ensure we never have overflow/clipping
      // on different zoom levels or sub-pixel rendering.
      const DOT_SIZE = 16;
      const GAP = 3;
      const BUFFER = 16;

      const calculatedCols = Math.floor((width + GAP) / (DOT_SIZE + GAP));
      const calculatedRows = Math.floor(
        (height - BUFFER + GAP) / (DOT_SIZE + GAP),
      );

      setGridDimensions((prev) => {
        if (prev.cols !== calculatedCols || prev.rows !== calculatedRows) {
          return {
            rows: Math.max(0, calculatedRows),
            cols: Math.max(0, calculatedCols),
          };
        }
        return prev;
      });
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          const {width, height} = entry.contentRect;
          calculateDimensions(width, height);
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
      // Initial calculation fallback
      const {width, height} = containerRef.current.getBoundingClientRect();
      calculateDimensions(width, height);
    }

    return () => observer.disconnect();
  }, []);

  // Update grid items array when dimensions change
  useEffect(() => {
    const totalSize = gridDimensions.rows * gridDimensions.cols;
    if (totalSize === 0) return;

    setGridItems((prev) => {
      // Only extend if needed. Never truncate to prevent data loss on resize oscillation.
      if (prev.length < totalSize) {
        const needed = totalSize - prev.length;
        const placeholders = Array.from({length: needed}).map((_, i) => ({
          id: Date.now() + Math.random() + i, // simple id
          txCount: -1, // -1 indicating empty/placeholder
        }));
        return [...prev, ...placeholders];
      }
      return prev;
    });
  }, [gridDimensions]);

  const lastFetchedHeight = useRef<number | null>(null);

  // Poll for ledger info to get the latest block height
  const {data: ledgerData} = useQuery({
    queryKey: ["ledgerInfo", state.network_value],
    queryFn: () => getLedgerInfo(state.aptos_client),
    refetchInterval: 1500, // Poll every 1.5s
  });

  const currentHeight = ledgerData ? parseInt(ledgerData.block_height) : null;

  useEffect(() => {
    if (currentHeight === null || gridItems.length === 0) return;

    const fetchBlocks = async () => {
      let startHeight = currentHeight;
      let endHeight = currentHeight;

      if (lastFetchedHeight.current === null) {
        lastFetchedHeight.current = currentHeight;
        startHeight = currentHeight;
        endHeight = currentHeight;
      } else if (currentHeight > lastFetchedHeight.current) {
        startHeight = lastFetchedHeight.current + 1;
        endHeight = currentHeight;
        lastFetchedHeight.current = currentHeight;
      } else {
        return;
      }

      try {
        const promises = [];
        for (let h = startHeight; h <= endHeight; h++) {
          promises.push(state.aptos_client.getBlockByHeight(h, false));
        }

        const newBlocks = await Promise.all(promises);

        // Process new blocks into items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newItems: GridItem[] = newBlocks.map((block: any) => {
          const txCount =
            parseInt(block.last_version) - parseInt(block.first_version) + 1;
          return {
            id: Date.now() + Math.random(),
            txCount,
            blockHeight: block.block_height,
            timestamp: block.block_timestamp,
            hash: block.block_hash,
            status: "Success",
          };
        });

        if (isHoveringRef.current) {
          // If hovering, accumulate updates without rendering
          pendingItemsRef.current = [...pendingItemsRef.current, ...newItems];
        } else {
          // If not hovering, apply updates immediately
          setGridItems((prev) => {
            // We need to apply newItems sequentially: oldest first so they get pushed down?
            // No, visual order: standard approach is prepend new items.
            // newBlocks is [H, H+1, ...]. H+1 is newer.
            // We want H+1 to be at index 0, H at index 1... finally.
            // So for [A, B] (A older, B newer), we want output [B, A, ...prev]

            // We reverse newItems so newest is first in the list to be prepended
            const updatesToAdd = [...newItems].reverse();
            const updatedList = [...updatesToAdd, ...prev];
            // Keep a large history to avoid flickering on resize
            return updatedList.slice(0, MAX_HISTORY_SIZE);
          });
        }
      } catch {
        // ignore errors
      }
    };

    fetchBlocks();
  }, [currentHeight, state.aptos_client, gridItems.length, gridDimensions]); // Add gridDimensions to update if resized

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    // Flush pending items
    if (pendingItemsRef.current.length > 0) {
      setGridItems((prev) => {
        // pendingItems are in fetch order (oldest to newest)
        // We want newest to be at the top.
        const updatesToAdd = [...pendingItemsRef.current].reverse();
        const updatedList = [...updatesToAdd, ...prev];
        return updatedList.slice(0, MAX_HISTORY_SIZE);
      });
      pendingItemsRef.current = [];
    }
  };

  return (
    <Box
      sx={{
        position: "relative", // Ensure positioning context
        // Remove static background properties so valid scrolling background visibility
        background: `radial-gradient(104.94% 81.65% at 50% 47.72%, #000 38.5%, rgba(0, 0, 0, 0.00) 100%)`,
        padding: "24px",
        borderRadius: "24px",
        overflow: "hidden", // Clip the code background
        display: "flex",
        justifyContent: "center", // Center the black content box
        alignItems: "center",
        ...sx,
      }}
    >
      <ScrollingCodeBackground />

      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Container for the dots with black background */}
        {gridDimensions.cols > 0 && (
          <Box
            // Attach hover handlers to the grid container
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
              display: "grid",
              // Sync columns with current items to prevent incomplete rows during resize
              gridTemplateColumns: `repeat(${gridDimensions.cols}, 16px)`,
              gap: "3px",
              alignContent: "center",
              justifyContent: "center",
              backgroundColor: "#000000", // Black background dots
              padding: "0px", // Remove padding to hug the dots
              borderRadius: "7px", // Match dot radius
              position: "relative", // Ensure on top of absolute background
              zIndex: 1,
              width: "fit-content", // Shrink wrap the grid
              margin: "0 auto", // Center
            }}
          >
            {gridItems
              .slice(0, gridDimensions.rows * gridDimensions.cols)
              .map((item) => (
                <CustomTooltip
                  key={item.id}
                  title={
                    item.blockHeight ? (
                      <Box sx={{minWidth: "180px"}}>
                        {/* Header: Block Height & Time */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography
                            fontWeight="700"
                            fontSize="14px"
                            color="#fff"
                          >
                            Block {item.blockHeight}
                          </Typography>
                          <Typography fontSize="12px" color="#888">
                            {moment(parseInt(item.timestamp!) / 1000).format(
                              "HH:mm:ss",
                            )}
                          </Typography>
                        </Box>

                        {/* Txs */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography fontSize="12px" color="#888">
                            Txs
                          </Typography>
                          <Typography fontSize="12px" color="#fff">
                            {item.txCount}
                          </Typography>
                        </Box>

                        {/* Hash (Proposer removed) */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography fontSize="12px" color="#888">
                            Hash
                          </Typography>
                          <Typography fontSize="12px" color="#888">
                            {truncateHash(item.hash)}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      ""
                    )
                  }
                  placement="top"
                >
                  <Box
                    sx={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: getActivityColor(item.txCount),
                      transition: "background-color 0.5s ease",
                      cursor: item.blockHeight ? "pointer" : "default",
                    }}
                  />
                </CustomTooltip>
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
