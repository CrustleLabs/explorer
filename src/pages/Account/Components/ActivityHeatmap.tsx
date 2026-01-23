import {Box, Stack, Typography, Tooltip} from "@mui/material";
import React, {useMemo} from "react";
import moment from "moment";
import {useGetAccountActivityHeatmap} from "../../../api/hooks/useGetAccountActivityHeatmap";

const ACTIVITY_COLORS = [
  "rgba(255,255,255,0.05)", // 0
  "#4A3F6B", // 1
  "#6B5B95", // 2
  "#8B7BB5", // 3
  "#CDB9F9", // 4
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type ActivityHeatmapProps = {
  address?: string;
};

export default function ActivityHeatmap({address = ""}: ActivityHeatmapProps) {
  const {transactions} = useGetAccountActivityHeatmap(address);

  const gridData = useMemo(() => {
    // 7 days x 24 hours initialization
    // We want rows = days, cols = hours
    const grid = Array.from({length: 7}).map(() =>
      Array.from({length: 24}).fill(0),
    ) as number[][];

    if (!transactions.length) return grid;

    transactions.forEach((tx) => {
      let m;
      // Check if timestamp appears to be an ISO string (contains 'T')
      if (typeof tx.timestamp === "string" && tx.timestamp.includes("T")) {
        m = moment(tx.timestamp);
      } else {
        // Assume microseconds if numeric
        m = moment(Number(tx.timestamp) / 1000);
      }

      if (!m.isValid()) return;

      const dayIndex = m.day(); // 0 (Sun) - 6 (Sat)
      const hourIndex = m.hour(); // 0 - 23

      // Ensure indices are valid just in case
      if (grid[dayIndex] && grid[dayIndex][hourIndex] !== undefined) {
        grid[dayIndex][hourIndex] += 1;
      }
    });

    return grid;
  }, [transactions]);

  const getColor = (count: number) => {
    if (count === 0) return ACTIVITY_COLORS[0];
    if (count <= 2) return ACTIVITY_COLORS[1];
    if (count <= 5) return ACTIVITY_COLORS[2];
    if (count <= 10) return ACTIVITY_COLORS[3];
    return ACTIVITY_COLORS[4];
  };

  return (
    <Box>
      <Typography
        sx={{
          color: "#666",
          fontSize: "12px",
          fontFamily: '"SF Pro", sans-serif',
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          mb: 2,
        }}
      >
        Activity Heatmap (Current Week)
      </Typography>

      <Stack direction="row" spacing={2} alignItems="flex-start">
        {/* Day labels column */}
        <Stack spacing={0.5} sx={{pt: 3.5}}>
          {DAY_LABELS.map((day, index) => (
            <Box
              key={index}
              sx={{
                height: 24, // Match new cell height
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                pr: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#666",
                  fontSize: "12px",
                  lineHeight: 1,
                  fontFamily: '"SF Pro"',
                }}
              >
                {day}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* 7x24 Grid */}
        <Box sx={{overflowX: "auto", width: "100%"}}>
          {/* Hour labels */}
          <Stack direction="row" spacing={0.5} mb={1} pl={0}>
            {Array.from({length: 24}).map((_, h) => (
              <Box key={h} sx={{width: 24, textAlign: "center"}}>
                {" "}
                {/* Match cell width */}
                {h % 4 === 0 ? ( // Show every 4th hour approx
                  <Typography
                    sx={{
                      color: "#888",
                      fontSize: "10px",
                      fontFamily: '"SF Pro"',
                    }}
                  >
                    {h}
                  </Typography>
                ) : null}
              </Box>
            ))}
          </Stack>

          <Stack spacing={0.5}>
            {gridData.map((dayRow, dayIndex) => (
              <Stack key={dayIndex} direction="row" spacing={0.5}>
                {dayRow.map((count, hourIndex) => (
                  <Tooltip
                    key={hourIndex}
                    title={`${DAY_LABELS[dayIndex]} ${hourIndex}:00 - ${count} txs`}
                    placement="top"
                  >
                    <Box
                      sx={{
                        width: 24, // Increased size
                        height: 24,
                        borderRadius: "4px",
                        backgroundColor: getColor(count),
                        cursor: "pointer",
                        "&:hover": {
                          opacity: 0.8,
                          border: "1px solid rgba(255,255,255,0.2)",
                        },
                      }}
                    />
                  </Tooltip>
                ))}
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* Legend below */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{mt: 3, ml: 6}}
      >
        <Typography
          sx={{color: "#666", fontSize: "12px", fontFamily: '"SF Pro"'}}
        >
          Less
        </Typography>
        {ACTIVITY_COLORS.map((color, index) => (
          <Box
            key={index}
            sx={{
              width: 24,
              height: 24,
              borderRadius: "4px",
              backgroundColor: color,
            }}
          />
        ))}
        <Typography
          sx={{color: "#666", fontSize: "12px", fontFamily: '"SF Pro"'}}
        >
          More
        </Typography>
      </Stack>
    </Box>
  );
}
