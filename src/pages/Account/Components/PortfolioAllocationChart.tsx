import {Box, LinearProgress, Stack, Typography} from "@mui/material";
import React from "react";

// Mock data for portfolio allocation
const MOCK_ALLOCATION = [
  {name: "EVM Balance", percentage: 0.0, value: 0.0, color: "#DC2971"},
  {name: "EVM Balance", percentage: 90.2, value: 19.2, color: "#03A881"},
  {name: "EVM Balance", percentage: 0.0, value: 0.0, color: "#8FC7FA"},
  {name: "EVM Balance", percentage: 0.7, value: 0.14, color: "#CDB9F9"},
  {name: "EVM Balance", percentage: 0.0, value: 0.0, color: "#FFB020"},
];

const CORE_PERCENTAGE = 100;

export default function PortfolioAllocationChart() {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(31, 28, 37, 0.6)",
        border: "0.5px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "24px",
        p: 4,
        height: "100%",
      }}
    >
      <Typography
        sx={{
          color: "#999",
          fontSize: "12px",
          fontFamily: '"SF Pro", sans-serif',
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          mb: 3,
        }}
      >
        Portfolio Allocation
      </Typography>

      <Stack direction="row" spacing={4}>
        {/* Donut Chart Placeholder */}
        <Box
          sx={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "20px solid #03A881",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Inner circle for donut effect */}
          <Box
            sx={{
              position: "absolute",
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "transparent",
            }}
          />
        </Box>

        {/* Allocation Details */}
        <Stack spacing={1.5} flex={1}>
          <Box
            sx={{display: "flex", justifyContent: "flex-end", gap: 4, mb: 1}}
          >
            <Typography
              sx={{color: "#666", fontSize: "12px", fontFamily: '"SF Pro"'}}
            >
              Details
            </Typography>
          </Box>

          {MOCK_ALLOCATION.map((item, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                  }}
                />
                <Typography
                  sx={{color: "#999", fontSize: "12px", fontFamily: '"SF Pro"'}}
                >
                  {item.name}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "12px",
                    fontFamily: '"SF Pro"',
                    minWidth: 40,
                    textAlign: "right",
                  }}
                >
                  {item.percentage.toFixed(1)}%
                </Typography>
                <Typography
                  sx={{
                    color: "#999",
                    fontSize: "12px",
                    fontFamily: '"SF Pro"',
                    minWidth: 50,
                    textAlign: "right",
                  }}
                >
                  ${item.value.toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* Core Progress Bar */}
      <Box sx={{mt: 4}}>
        <LinearProgress
          variant="determinate"
          value={CORE_PERCENTAGE}
          sx={{
            height: 32,
            borderRadius: "8px",
            backgroundColor: "rgba(255,255,255,0.08)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#03A881",
              borderRadius: "8px",
            },
          }}
        />
        <Stack direction="row" justifyContent="center" sx={{mt: -3.5}}>
          <Typography
            sx={{
              color: "#fff",
              fontSize: "14px",
              fontFamily: '"SF Pro"',
              fontWeight: 500,
            }}
          >
            Core - {CORE_PERCENTAGE}%
          </Typography>
        </Stack>

        {/* Legend */}
        <Stack direction="row" spacing={3} sx={{mt: 3}}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#03A881",
              }}
            />
            <Typography
              sx={{color: "#666", fontSize: "12px", fontFamily: '"SF Pro"'}}
            >
              Core - 100%
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#999",
              }}
            />
            <Typography
              sx={{color: "#666", fontSize: "12px", fontFamily: '"SF Pro"'}}
            >
              EVM - 0%
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
