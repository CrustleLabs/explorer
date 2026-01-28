import Box from "@mui/material/Box";
import {useEffect, useState, useRef} from "react";

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

const getActivityColor = (txCount: number) => {
  if (txCount === -1) return ACTIVITY_COLORS[6]; // Placeholder color
  const index = Math.min(Math.floor(txCount / 2), ACTIVITY_COLORS.length - 2); // -1 for index, -1 for last color reservation
  return ACTIVITY_COLORS[index];
};

interface GridItem {
  id: string; // Changed to string for more stable IDs
  txCount: number;
  blockHeight?: string;
  timestamp?: string; // microseconds
  status?: string;
  hash?: string;
}

interface ActivityGraphProps {
  sx?: SxProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentBlocks?: any[];
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

export default function ActivityGraph({
  sx,
  recentBlocks = [],
}: ActivityGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Start with 0,0 to prevent rendering before proper size calculation
  const [gridDimensions, setGridDimensions] = useState({rows: 0, cols: 0});
  const [gridItems, setGridItems] = useState<GridItem[]>([]);

  // Single shared tooltip state - performance optimization
  const [hoveredItem, setHoveredItem] = useState<GridItem | null>(null);
  const [tooltipAnchor, setTooltipAnchor] = useState<HTMLElement | null>(null);

  // Use ref to always have current dimensions in async callbacks
  const dimensionsRef = useRef({rows: 0, cols: 0});

  // Refs for hover pause logic
  const isHoveringRef = useRef(false);
  const pendingItemsRef = useRef<GridItem[]>([]);

  // Calculate grid dimensions based on container width
  useEffect(() => {
    const calculateDimensions = (width: number, height: number) => {
      // Inner Logic: Available Size / (Dot(16) + Gap(3))
      const DOT_SIZE = 16;
      const GAP = 3;

      const calculatedCols = Math.floor((width + GAP) / (DOT_SIZE + GAP));
      const calculatedRows = Math.floor((height + GAP) / (DOT_SIZE + GAP));

      setGridDimensions((prev) => {
        if (prev.cols !== calculatedCols || prev.rows !== calculatedRows) {
          const newDims = {
            rows: Math.max(0, calculatedRows),
            cols: Math.max(0, calculatedCols),
          };
          // Keep ref in sync for use in async callbacks
          dimensionsRef.current = newDims;
          return newDims;
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

  // Update grid items array when dimensions change - always match exactly totalSize
  useEffect(() => {
    const totalSize = gridDimensions.rows * gridDimensions.cols;
    if (totalSize === 0) return;

    setGridItems((prev) => {
      if (prev.length === totalSize) {
        return prev; // Already correct size
      }
      if (prev.length < totalSize) {
        // Need to add placeholders at the end
        const needed = totalSize - prev.length;
        const placeholders = Array.from({length: needed}).map((_, i) => ({
          id: `placeholder-${prev.length + i}`, // Stable placeholder IDs
          txCount: -1, // -1 indicating empty/placeholder
        }));
        return [...prev, ...placeholders];
      }
      // prev.length > totalSize - truncate to fit
      return prev.slice(0, totalSize);
    });
  }, [gridDimensions]);

  // Process incoming blocks
  useEffect(() => {
    if (!recentBlocks || recentBlocks.length === 0) return;

    // Filter out blocks we already have processed?
    // Actually, recentBlocks from WS will be accumulating.
    // But ActivityGraph grid uses a scrolling buffer approach.
    // If we just mapped recentBlocks to items, we might replace the whole grid if recentBlocks is small/large.
    // The previous logic accumulated updates selectively.
    // However, if recentBlocks is the *latest* list (e.g. 30 items), and our grid is 200 items,
    // we want to prepend ONLY the new ones we haven't seen.

    // For simplicity with WS hook (which manages duplicates), let's assume valid new blocks at the top.

    // Convert all recent blocks to items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemsFromProps: GridItem[] = recentBlocks.map((block: any) => {
      let txCount = 0;
      if (block.tx_count !== undefined) {
        txCount = block.tx_count;
      } else if (block.first_version && block.last_version) {
        txCount =
          parseInt(block.last_version) - parseInt(block.first_version) + 1;
      }
      return {
        id: `block-${block.block_height}`,
        txCount,
        blockHeight: block.block_height,
        timestamp: block.block_timestamp,
        hash: block.block_hash,
        status: "Success",
      };
    });

    // Find new items that are NOT in current gridItems (by ID)
    // Optimization: check IDs set.
    const currentIds = new Set(gridItems.map((i) => i.id));
    const newItems = itemsFromProps.filter((item) => !currentIds.has(item.id));

    if (newItems.length === 0) return;

    // Since recentBlocks is newest first, the new items are likely at the TOP.
    // We reverse so we can append them in order if we were building upwards,
    // OR we iterate naturally if we prepend.

    // If we have new items [Block 102, Block 101] and grid has [Block 100...]
    // We want final grid: [102, 101, 100...]

    // NOTE: newItems from filter might lose order if we are not careful?
    // itemsFromProps is [Newest...Oldest].
    // gridItems is [Newest...Oldest].
    // so newItems will be the top of itemsFromProps.

    // If isHovering, buffer them.
    if (isHoveringRef.current) {
      pendingItemsRef.current = [...newItems, ...pendingItemsRef.current];
    } else {
      const {rows, cols} = dimensionsRef.current;
      const totalSize = rows * cols;
      if (totalSize > 0) {
        setGridItems((prev) => {
          const updated = [...newItems, ...prev].slice(0, totalSize);
          return updated;
        });
      }
    }
  }, [recentBlocks, gridItems, gridDimensions]);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    // Flush pending items using current dimensions from ref
    const {rows, cols} = dimensionsRef.current;
    const totalSize = rows * cols;
    if (pendingItemsRef.current.length > 0 && totalSize > 0) {
      setGridItems((prev) => {
        // pendingItems are in fetch order (oldest to newest)
        // We want newest to be at the top.
        const updatesToAdd = [...pendingItemsRef.current].reverse();
        const updatedList = [...updatesToAdd, ...prev];
        // Strictly limit to visible grid size
        return updatedList.slice(0, totalSize);
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
        {gridDimensions.cols > 0 &&
          (() => {
            const totalSlots = gridDimensions.rows * gridDimensions.cols;
            const renderCount = Math.min(gridItems.length, totalSlots);
            if (gridItems.length !== totalSlots) {
              console.warn("[ActivityGraph] RENDER MISMATCH:", {
                gridItemsLength: gridItems.length,
                totalSlots,
                rows: gridDimensions.rows,
                cols: gridDimensions.cols,
                willRender: renderCount,
              });
            }
            return null;
          })()}
        {gridDimensions.cols > 0 && (
          <Box
            // Attach hover handlers to the grid container
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
              display: "grid",
              // Sync columns with current items to prevent incomplete rows during resize
              gridTemplateColumns: `repeat(${gridDimensions.cols}, 16px)`,
              gridTemplateRows: `repeat(${gridDimensions.rows}, 16px)`,
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
              overflow: "hidden", // Prevent overflow
            }}
          >
            {gridItems
              .slice(0, gridDimensions.rows * gridDimensions.cols)
              .map((item) => (
                <Box
                  key={item.id}
                  onMouseEnter={(e) => {
                    if (item.blockHeight) {
                      setHoveredItem(item);
                      setTooltipAnchor(e.currentTarget);
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredItem(null);
                    setTooltipAnchor(null);
                  }}
                  sx={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: getActivityColor(item.txCount),
                    transition: "background-color 0.5s ease",
                    cursor: item.blockHeight ? "pointer" : "default",
                  }}
                />
              ))}
          </Box>
        )}
        {/* Single shared tooltip - performance optimization */}
        <CustomTooltip
          open={hoveredItem !== null && tooltipAnchor !== null}
          title={
            hoveredItem?.blockHeight ? (
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
                  <Typography fontWeight="700" fontSize="14px" color="#fff">
                    Block {hoveredItem.blockHeight}
                  </Typography>
                  <Typography fontSize="12px" color="#888">
                    {moment(parseInt(hoveredItem.timestamp!) / 1000).format(
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
                    {hoveredItem.txCount}
                  </Typography>
                </Box>

                {/* Hash */}
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
                    {truncateHash(hoveredItem.hash)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              ""
            )
          }
          placement="top"
          PopperProps={{
            anchorEl: tooltipAnchor,
          }}
        >
          {/* Invisible anchor element for the tooltip */}
          <Box sx={{position: "absolute", visibility: "hidden"}} />
        </CustomTooltip>
      </Box>
    </Box>
  );
}
