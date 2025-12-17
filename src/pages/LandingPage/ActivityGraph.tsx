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

const GRID_SIZE = 234;

interface ActivityGraphProps {
  sx?: SxProps;
}

export default function ActivityGraph({sx}: ActivityGraphProps) {
  const [state] = useGlobalState();
  const [gridItems, setGridItems] = useState<GridItem[]>(
    Array.from({length: GRID_SIZE}).map((_, i) => ({
      id: i,
      txCount: 0,
    })),
  );
  const lastFetchedHeight = useRef<number | null>(null);

  // Poll for ledger info to get the latest block height
  const {data: ledgerData} = useQuery({
    queryKey: ["ledgerInfo", state.network_value],
    queryFn: () => getLedgerInfo(state.aptos_client),
    refetchInterval: 1500, // Poll every 1.5s
  });

  const currentHeight = ledgerData ? parseInt(ledgerData.block_height) : null;

  useEffect(() => {
    if (currentHeight === null) return;

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

        setGridItems((prev) => {
          let updated = [...prev];
          newBlocks.forEach((block) => {
            const txCount =
              parseInt(block.last_version) - parseInt(block.first_version) + 1;

            // Remove the oldest item (first one) and add the new one at the end
            // shifting everything to the 'left' or 'up' visually depending on layout
            updated = [
              {id: Date.now() + Math.random(), txCount},
              ...updated.slice(0, updated.length - 1),
            ];
          });
          return updated;
        });
      } catch {
        // ignore errors
      }
    };

    fetchBlocks();
  }, [currentHeight, state.aptos_client]);

  return (
    <Box
      sx={{
        position: "relative", // Ensure positioning context
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        justifyContent: "space-between", // Align right
        // Remove static background properties
        // backgroundImage: `url(${blockSpotBg})`, ...
        backgroundColor: "#000000", // Pure black background
        padding: "24px",
        borderRadius: "24px",
        overflow: "hidden", // Clip the code background
        ...sx,
      }}
    >
      <ScrollingCodeBackground />

      {gridItems.map((item) => (
        <Box
          key={item.id}
          sx={{
            width: "14px",
            height: "14px",
            borderRadius: "50%", // Circular
            backgroundColor: getActivityColor(item.txCount),
            transition: "background-color 0.5s ease",
            position: "relative", // Ensure on top of absolute background
            zIndex: 1,
          }}
        />
      ))}
    </Box>
  );
}
