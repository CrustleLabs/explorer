import {Paper, Skeleton, Stack, Typography} from "@mui/material";
import {Block, TransactionResponse} from "@aptos-labs/ts-sdk";

export default function BlockStatsRow({
  data,
  isLoading,
}: {
  data?: Block;
  isLoading?: boolean;
}) {
  const transactions = data?.transactions ?? [];
  const total = transactions.length;
  const successCount = transactions.filter(
    (txn: TransactionResponse) => "success" in txn && txn.success,
  ).length;
  const failedCount = total - successCount;
  const successRate =
    total > 0 ? ((successCount / total) * 100).toFixed(1) + "%" : "-";

  const stats = [
    {
      label: "Block Height",
      value: data ? parseInt(data.block_height).toLocaleString() : "-",
      color: "#fff",
      bgColor: "#16141A",
    },
    {
      label: "Transactions",
      value: total.toLocaleString(),
      color: "#fff",
      bgColor: "#16141A",
    },
    {
      label: "Success rate",
      value: successRate,
      color: "#fff",
      bgColor: "#16141A",
    },
    {
      label: "Failed",
      value: failedCount.toLocaleString(),
      color: "#DC2971", // Error color from design
      bgColor: "#16141A", // Dark background
    },
  ];

  return (
    <Stack direction="row" spacing={2} width="100%">
      {stats.map((stat, index) => (
        <Paper
          key={index}
          sx={{
            flex: 1,
            backgroundColor: stat.bgColor,
            borderRadius: "16px",
            border: "0.5px solid rgba(255,255,255,0.12)",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
          elevation={0}
        >
          <Typography
            sx={{
              color: "#999",
              fontSize: "14px",
              fontFamily: '"SF Pro", sans-serif',
            }}
          >
            {stat.label}
          </Typography>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={32} />
          ) : (
            <Typography
              sx={{
                color: stat.color,
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              {stat.value}
            </Typography>
          )}
        </Paper>
      ))}
    </Stack>
  );
}
