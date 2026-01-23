import {Box, LinearProgress, Skeleton, Stack, Typography} from "@mui/material";
import {Block} from "@aptos-labs/ts-sdk";

export default function TransactionBreakdown({
  data,
  isLoading,
}: {
  data?: Block;
  isLoading?: boolean;
}) {
  const transactions = data?.transactions ?? [];
  const total = transactions.length;

  // Count by type
  const typeCounts: Record<string, number> = {};
  transactions.forEach((txn) => {
    const type = txn.type;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  // Calculate percentages and sort
  const breakdown = Object.entries(typeCounts)
    .map(([type, count]) => ({
      type,
      count,
      percent: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Box
          sx={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#8FC7FA", // Lighter background color
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              width: 24,
              height: 24,
            }}
          >
            <path
              d="M5.5 9.47139C6.94445 7.66667 9.44809 5.5 12.0006 5.5C15.3459 5.5 18.1009 8.02742 18.4603 11.277M5.5 9.47139V6.22139M5.5 9.47139H8.75M5.54129 12.7249C5.90198 15.9732 8.65633 18.4991 12.0006 18.4991C14.5514 18.4991 17.0556 16.3333 18.5 14.5269M18.5 14.5269V17.7769M18.5 14.5269H15.25"
              stroke="black"
              strokeWidth="1.86667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#fff",
            fontFamily: '"SF Pro", sans-serif',
          }}
        >
          Transaction Breakdown
        </Typography>
      </Stack>

      <Stack spacing={3}>
        {isLoading ? (
          // Skeleton Loading
          Array.from({length: 3}).map((_, index) => (
            <Box key={index}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Skeleton
                  variant="text"
                  width="60%"
                  sx={{bgcolor: "#2e2d32"}}
                />
                <Skeleton
                  variant="text"
                  width="20%"
                  sx={{bgcolor: "#2e2d32"}}
                />
              </Stack>
              <Skeleton
                variant="rounded"
                height={8}
                sx={{borderRadius: 4, bgcolor: "rgba(255,255,255,0.08)"}}
              />
            </Box>
          ))
        ) : breakdown.length > 0 ? (
          breakdown.map((item) => (
            <Box key={item.type}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "14px",
                    fontFamily: '"SF Pro", sans-serif',
                  }}
                >
                  {item.type}{" "}
                  <span style={{color: "#666"}}>{item.count} transactions</span>
                </Typography>
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "14px",
                    fontFamily: '"SF Pro", sans-serif',
                  }}
                >
                  {item.percent.toFixed(1)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={item.percent}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#B692F4", // Brand color from Figma
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          ))
        ) : (
          <Typography sx={{color: "#666", fontSize: "14px"}}>
            No transactions found
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
