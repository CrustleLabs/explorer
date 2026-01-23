import {Box, Stack, Typography} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import {useGetAccountOrders} from "../../../api/hooks/useGetAccountOrders";
import btcIcon from "../../../assets/svg/perps/btc.svg";
import ethIcon from "../../../assets/svg/perps/eth.svg";

type Activity = {
  action: string;
  actionColor: string;
  symbol: string;
  amount: string;
  time: string;
  status: string;
  statusColor: string;
  statusBg: string;
  rawStatus: number;
  txnVersion?: string;
};

function ActivityCard({activity}: {activity: Activity}) {
  const navigate = useNavigate();

  const getIcon = (symbol: string) => {
    if (symbol.includes("BTC")) return btcIcon;
    if (symbol.includes("ETH")) return ethIcon;
    return null;
  };

  const iconSrc = getIcon(activity.symbol);

  const handleClick = () => {
    if (activity.txnVersion) {
      navigate(`/txn/${activity.txnVersion}`);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        backgroundColor: "rgba(31, 28, 37, 0.6)",
        border: "0.5px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "12px",
        p: 2,
        minWidth: 160,
        cursor: activity.txnVersion ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: activity.txnVersion
            ? "rgba(31, 28, 37, 0.8)"
            : "rgba(31, 28, 37, 0.6)",
          borderColor: activity.txnVersion
            ? "rgba(255, 255, 255, 0.24)"
            : "rgba(255, 255, 255, 0.12)",
          transform: activity.txnVersion ? "translateY(-2px)" : "none",
        },
      }}
    >
      {/* Header with icon and time */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: "#232227",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {iconSrc ? (
            <img
              src={iconSrc}
              alt={activity.symbol}
              style={{width: "100%", height: "100%", objectFit: "cover"}}
            />
          ) : (
            <CloseIcon sx={{fontSize: 14, color: "#999"}} />
          )}
        </Box>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography
            sx={{color: "#666", fontSize: "10px", fontFamily: '"SF Pro"'}}
          >
            {activity.time}
          </Typography>
          <Box sx={{color: "#666", fontSize: 12}}>↗</Box>
        </Stack>
      </Stack>

      {/* Action details */}
      <Stack spacing={0.5}>
        <Typography
          sx={{
            color: activity.actionColor,
            fontSize: "12px",
            fontFamily: '"SF Pro"',
            fontWeight: 500,
          }}
        >
          {activity.action}
        </Typography>
        <Typography
          sx={{color: "#666", fontSize: "12px", fontFamily: '"SF Pro"'}}
        >
          {activity.symbol}
        </Typography>
        <Typography
          sx={{color: "#fff", fontSize: "12px", fontFamily: '"SF Pro"'}}
        >
          {activity.amount}
        </Typography>

        {/* Status Capsule */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: activity.statusBg,
            borderRadius: "4px",
            px: 0.8,
            py: 0.2, // Capsule padding
            width: "fit-content",
            mt: 0.5,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: activity.statusColor,
              mr: 0.5,
            }}
          />
          <Typography
            sx={{
              color: activity.statusColor,
              fontSize: "10px",
              fontFamily: '"SF Pro"',
              fontWeight: 500,
            }}
          >
            {activity.status}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default function LatestActivityList({address}: {address?: string}) {
  const {orders} = useGetAccountOrders(address || "");

  // Map orders to activities
  const activities = orders.map((order) => {
    // User logic: order_side 1 is Buy, else Sell
    const isBuy = order.order_side === 1;

    const timeAgo =
      moment(order.place_at)
        .fromNow(true)
        .replace("minutes", "m")
        .replace("minute", "m")
        .replace("hours", "h")
        .replace("hour", "h")
        .replace("days", "d")
        .replace("day", "d")
        .replace("seconds", "s")
        .replace("second", "s") + " ago";

    // Status derivation logic
    let status = "Unknown";
    let statusColor = "#666";
    let statusBg = "rgba(255, 255, 255, 0.08)";

    if (order.size === order.filled_size && order.size > 0) {
      status = "Filled";
      statusColor = "#03A881";
      statusBg = "rgba(3, 168, 129, 0.12)";
    } else if (order.filled_size === 0) {
      status = "Pending";
      statusColor = "#F2994A";
      statusBg = "rgba(242, 153, 74, 0.12)";
    } else if (order.filled_size > 0 && order.filled_size < order.size) {
      status = "Partially";
      statusColor = "#2D9CDB";
      statusBg = "rgba(45, 156, 219, 0.12)";
    }

    return {
      action: isBuy ? "Buy" : "Sell",
      actionColor: isBuy ? "#03A881" : "#DC2971",
      symbol: order.ticker,
      amount: (isBuy ? "+" : "-") + Number(order.size).toFixed(4),
      time: timeAgo,
      status,
      statusColor,
      statusBg,
      rawStatus: order.status,
      txnVersion: order.created_transaction,
    };
  });

  if (!activities.length) {
    return (
      <Box>
        {/* Header */}
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
          Latest Activity
        </Typography>
        <Typography sx={{color: "#666", fontSize: "14px"}}>
          No recent activity
        </Typography>
      </Box>
    );
  }

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
        Latest Activity
      </Typography>

      {/* Activity Grid - 2 columns */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
        }}
      >
        {activities.map((activity, index) => (
          <ActivityCard key={index} activity={activity} />
        ))}
      </Box>
    </Box>
  );
}
