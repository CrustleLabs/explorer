import React from "react";
import {Stack, Typography, Box, Tooltip} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {Types} from "aptos";
import {Link} from "react-router-dom";
import {TransactionStatus} from "../../components/TransactionStatus";
import TimestampValue from "../../components/IndividualPageContent/ContentValue/TimestampValue";
import {APTCurrencyValue} from "../../components/IndividualPageContent/ContentValue/CurrencyValue";
import {useGlobalState} from "../../global-config/GlobalConfig";
import CubeIcon from "../../assets/svg/cube.svg?react";

type SidebarProps = {
  transaction: Types.Transaction;
};

const SidebarRow = ({
  title,
  value,
}: {
  title: string;
  value: React.ReactNode;
}) => (
  <Box>
    <Typography
      variant="caption"
      color="#999"
      display="block"
      mb={0.5}
      fontFamily='"SF Pro", sans-serif'
    >
      {title}
    </Typography>
    <Box
      color="text.primary"
      fontFamily='"SF Pro", sans-serif'
      fontWeight={400}
      fontSize="14px"
    >
      {value}
    </Box>
  </Box>
);

export default function TransactionSidebar({transaction}: SidebarProps) {
  // Cast to specific type to access fields safely, though mostly common fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txn = transaction as any;
  const [state] = useGlobalState();
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 2000);
  };

  if (txn.payload?.type === "dex_orderless_payload") {
    // Placeholder values - these would come from an API in a real implementation
    const totalValue = 14670.65;
    const unrealizedPnl = -4670.65;
    const totalPnl = -4670.65;

    return (
      <Box
        sx={{
          backgroundColor: "#16141a",
          border: "1.5px solid rgba(255,255,255,0.06)",
          borderRadius: "24px",
          padding: "24px",
          height: "fit-content",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          marginBottom={4}
        >
          <Box
            sx={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#B692F4",
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
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.6523 17.2304C15.5872 15.8247 13.8996 14.9167 12 14.9167C10.1004 14.9167 8.4128 15.8247 7.34769 17.2304M16.6523 17.2304C18.0927 15.9483 19 14.0801 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 14.0801 5.90728 15.9483 7.34769 17.2304M16.6523 17.2304C15.4156 18.3312 13.7859 19 12 19C10.2141 19 8.58439 18.3312 7.34769 17.2304M14.3333 10.25C14.3333 11.5387 13.2887 12.5833 12 12.5833C10.7113 12.5833 9.66667 11.5387 9.66667 10.25C9.66667 8.96134 10.7113 7.91667 12 7.91667C13.2887 7.91667 14.3333 8.96134 14.3333 10.25Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
          <Typography
            variant="h6"
            fontFamily='"SF Pro", sans-serif'
            fontWeight={600}
            color="#fff"
            fontSize="18px"
          >
            Account Information
          </Typography>
        </Stack>

        <Stack spacing={3}>
          {/* User Address */}
          <Box>
            <Typography
              sx={{
                color: "#666",
                fontSize: "11px",
                mb: 0.5,
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              User
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                backgroundColor: "rgba(182,146,244,0.16)",
                border: "0.5px solid rgba(217,203,251,0.12)",
                borderRadius: "40px",
                padding: "6px 12px",
                width: "fit-content",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: '"SF Pro", sans-serif',
                }}
              >
                {txn.sender
                  ? `${txn.sender.slice(0, 6)}...${txn.sender.slice(-6)}`
                  : "-"}
              </Typography>
              <Tooltip
                title="Copied"
                open={tooltipOpen}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                placement="right"
              >
                <Box
                  component="span"
                  onClick={(e) => handleCopy(e, txn.sender || "")}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "rgba(255, 255, 255, 0.6)",
                    "&:hover": {
                      color: "#FFFFFF",
                    },
                  }}
                >
                  <ContentCopyIcon sx={{fontSize: 14}} />
                </Box>
              </Tooltip>
            </Stack>
          </Box>

          {/* Total Value */}
          <Box>
            <Typography
              sx={{
                color: "#666",
                fontSize: "11px",
                mb: 0.5,
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              Total Value
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "24px",
                fontWeight: 700,
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>

          {/* Unrealized P&L */}
          <Box>
            <Typography
              sx={{
                color: "#666",
                fontSize: "11px",
                mb: 0.5,
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              Unrealized P&L
            </Typography>
            <Typography
              sx={{
                color: unrealizedPnl >= 0 ? "#03A881" : "#DC2971",
                fontSize: "24px",
                fontWeight: 700,
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              {unrealizedPnl >= 0 ? "+" : ""}$
              {unrealizedPnl.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>

          {/* Total P&L */}
          <Box>
            <Typography
              sx={{
                color: "#666",
                fontSize: "11px",
                mb: 0.5,
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              Total P&L
            </Typography>
            <Typography
              sx={{
                color: totalPnl >= 0 ? "#03A881" : "#DC2971",
                fontSize: "24px",
                fontWeight: 700,
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              {totalPnl >= 0 ? "+" : ""}$
              {totalPnl.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#16141a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "24px",
        padding: "24px",
        height: "fit-content",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} marginBottom={4}>
        <Box
          sx={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#F2DDD3",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CubeIcon />
        </Box>
        <Typography
          variant="h6"
          fontFamily='"SF Pro", sans-serif'
          fontWeight={600}
          color="#fff"
        >
          Block Details
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <SidebarRow
          title="Block"
          value={
            "block_height" in txn ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                padding="6px 12px"
                sx={{
                  backgroundColor: "rgba(182,146,244,0.16)",
                  border: "0.5px solid rgba(217,203,251,0.12)",
                  borderRadius: "40px",
                  width: "fit-content",
                  "&:hover": {
                    backgroundColor: "rgba(182,146,244,0.24)",
                  },
                }}
              >
                <Link
                  to={`/block/${txn.block_height}?network=${state.network_name}`}
                  style={{textDecoration: "none", color: "inherit"}}
                >
                  <Typography
                    fontFamily='"SF Pro", sans-serif'
                    fontWeight={500}
                    fontSize="16px"
                    color="#FFFFFF"
                  >
                    {txn.block_height}
                  </Typography>
                </Link>
                <Tooltip
                  title="Copied"
                  open={tooltipOpen}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  placement="right"
                >
                  <Box
                    component="span"
                    onClick={(e) => handleCopy(e, txn.block_height.toString())}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "rgba(255, 255, 255, 0.6)",
                      "&:hover": {
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    <ContentCopyIcon sx={{fontSize: 16}} />
                  </Box>
                </Tooltip>
              </Stack>
            ) : (
              "-"
            )
          }
        />

        {txn.replay_protection_nonce && (
          <SidebarRow
            title="Replay Protection Nonce"
            value={txn.replay_protection_nonce}
          />
        )}

        {txn.gas_used && txn.gas_unit_price && (
          <SidebarRow
            title="Gas Fee"
            value={
              <APTCurrencyValue
                amount={(
                  BigInt(txn.gas_used) * BigInt(txn.gas_unit_price)
                ).toString()}
              />
            }
          />
        )}

        {txn.gas_unit_price && (
          <SidebarRow
            title="Gas Unit Price"
            value={<APTCurrencyValue amount={txn.gas_unit_price} />}
          />
        )}

        {txn.max_gas_amount && (
          <SidebarRow
            title="Max Gas Limit"
            value={parseInt(txn.max_gas_amount).toLocaleString() + " Gas Units"}
          />
        )}

        <SidebarRow
          title="VM Status"
          value={<TransactionStatus success={txn.success} />}
        />

        <SidebarRow
          title="Timestamp"
          value={
            <TimestampValue
              timestamp={txn.timestamp}
              ensureMilliSeconds={true}
            />
          }
        />
      </Stack>
    </Box>
  );
}
