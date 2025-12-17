import Box from "@mui/material/Box";
import {useEffect, useState, useRef} from "react";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {getLedgerInfo} from "../../api";
import {useQuery} from "@tanstack/react-query";
import {SxProps} from "@mui/material";
import ScrollingCodeBackground from "./ScrollingCodeBackground";

// Activity grid colors from Figma
const ACTIVITY_COLORS = [
  "#2C2835", // Darkest
  "#F6F4FE", // Very Light
  "#F0EAFD", // Light Purple-ish
  "#D9CBFB", // Light Purple
  "#CDB9F9", // Medium Purple
  "#B692F4", // Darker Purple
];

const getActivityColor = (txCount: number) => {
  const index = Math.min(Math.floor(txCount / 2), ACTIVITY_COLORS.length - 1);
  return ACTIVITY_COLORS[index];
};

interface GridItem {
  id: number;
  txCount: number;
}

interface ActivityGraphProps {
  sx?: SxProps;
}

export default function ActivityGraph({sx}: ActivityGraphProps) {
  const [state] = useGlobalState();
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridDimensions, setGridDimensions] = useState({rows: 9, cols: 0});
  const [gridItems, setGridItems] = useState<GridItem[]>([]);

  // Calculate grid dimensions based on container width
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // Inner Logic: Available Width / (Dot(14) + Gap(6))
        // We subtract a small buffer to avoid overflow issues
        const DOT_SIZE = 14;
        const GAP = 6;
        const calculatedCols = Math.floor((width + GAP) / (DOT_SIZE + GAP));

        setGridDimensions((prev) => {
          if (prev.cols !== calculatedCols) {
            return {...prev, cols: calculatedCols};
          }
          return prev;
        });
      }
    };

    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
      // Initial calculation
      updateDimensions();
    }

    return () => observer.disconnect();
  }, []);

  // Update grid items array when dimensions change
  useEffect(() => {
    const totalSize = gridDimensions.rows * gridDimensions.cols;
    if (totalSize === 0) return;

    setGridItems((prev) => {
      if (prev.length === totalSize) return prev;

      const newItems = Array.from({length: totalSize}).map((_, i) => {
        // Preserve existing items if possible, or create new ones
        if (i < prev.length) return prev[i];
        return {
          id: i, // simple id for initial
          txCount: 0,
        };
      });
      return newItems;
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
        // Limit fetching to a reasonable amount if grid is huge, but here we just fetch needed blocks
        // For the visual updates (adding new dots), we only need 1 per block typically?
        // Actually the logic below maps 1 block -> 1 dot shift.
        // We fetch range.
        for (let h = startHeight; h <= endHeight; h++) {
          promises.push(state.aptos_client.getBlockByHeight(h, false));
        }

        const newBlocks = await Promise.all(promises);

        setGridItems((prev) => {
          let updated = [...prev];
          newBlocks.forEach((block) => {
            const txCount =
              parseInt(block.last_version) - parseInt(block.first_version) + 1;

            // Add new item at the start and remove the last one
            updated = [
              {id: Date.now() + Math.random(), txCount}, // Add new at start
              ...updated.slice(0, updated.length - 1), // Remove last
            ];
          });
          return updated;
        });
      } catch {
        // ignore errors
      }
    };

    fetchBlocks();
  }, [currentHeight, state.aptos_client, gridItems.length]); // Add gridItems.length dep to ensure we have initialized grid

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

      {/* Measure Ref Wrapper - takes full width to measure available space */}
      <Box
        ref={containerRef}
        sx={{width: "100%", display: "flex", justifyContent: "center"}}
      >
        {/* Container for the dots with black background */}
        {gridDimensions.cols > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridDimensions.cols}, 14px)`, // Dynamic columns
              gap: "6px",
              alignContent: "center",
              justifyContent: "center",
              backgroundColor: "#000000", // Black background behind dots
              padding: "0px", // Remove padding to hug the dots
              borderRadius: "7px", // Match dot radius
              position: "relative", // Ensure on top of absolute background
              zIndex: 1,
              width: "fit-content", // Shrink wrap the grid
              margin: "0 auto", // Center
            }}
          >
            {gridItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%", // Circular
                  backgroundColor: getActivityColor(item.txCount),
                  transition: "background-color 0.5s ease",
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
