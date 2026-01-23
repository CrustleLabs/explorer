import {Box, Stack, Typography, CircularProgress} from "@mui/material";
import React, {useMemo} from "react";
import {useGetDexTransfers} from "../../../api/hooks/useGetDexTransfers";
import IdenticonImg from "../../../components/IdenticonImg";

type FundFlowDiagramProps = {
  address: string;
};

// Helper to shorten address
const shortenAddress = (addr: string) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export default function FundFlowDiagram({address}: FundFlowDiagramProps) {
  const {data: dexTransfersData, isLoading} = useGetDexTransfers(address);

  // Process transfers to aggregate flows
  const flows = useMemo(() => {
    if (!dexTransfersData?.dex_transfers) return [];

    const flowMap = new Map<
      string,
      {
        source: string;
        target: string;
        sourceLabel: string;
        targetLabel: string;
        value: number;
        count: number;
        isInflow: boolean;
      }
    >();

    dexTransfersData.dex_transfers.forEach((txn) => {
      // Determine direction relative to Main Account (address)
      // Note: We need to check if 'address' is one of the parties.
      // But typically indexer returns transfers relevant to the address.
      // We'll group by "Sender -> Recipient".

      const key = `${txn.sender_address}-${txn.recipient_address}`;
      const existing = flowMap.get(key);

      const amount = txn.amount / 1e6; // Assuming 6 decimals for USDC usually, or checking coin type?
      // For now assuming USDC (1e6) as per existing code patterns.

      if (existing) {
        existing.value += amount;
        existing.count += 1;
      } else {
        const isFromMain =
          txn.sender_address.toLowerCase() === address?.toLowerCase();
        // Label logic
        let sourceLabel = "External Address";
        let targetLabel = "External Address";

        if (txn.sender_sub_number === "0") sourceLabel = "Main Account";
        else sourceLabel = `SubAccount ${txn.sender_sub_number}`;

        if (txn.recipient_sub_number === "0") targetLabel = "Main Account";
        else targetLabel = `SubAccount ${txn.recipient_sub_number}`;

        // Override labels if matching current address props (though sub_number 0 usually implies it)
        if (txn.sender_address.toLowerCase() === address?.toLowerCase()) {
          sourceLabel = "Main Account (You)";
        }
        if (txn.recipient_address.toLowerCase() === address?.toLowerCase()) {
          targetLabel = "Main Account (You)";
        }

        flowMap.set(key, {
          source: txn.sender_address,
          target: txn.recipient_address,
          sourceLabel,
          targetLabel,
          value: amount,
          count: 1,
          isInflow: !isFromMain,
        });
      }
    });

    return Array.from(flowMap.values());
  }, [dexTransfersData, address]);

  if (isLoading) {
    return (
      <Box sx={{p: 4, display: "flex", justifyContent: "center"}}>
        <CircularProgress size={24} sx={{color: "#8FC7FA"}} />
      </Box>
    );
  }

  if (flows.length === 0) {
    return null; // Don't show if no flows
  }

  // Calculate totals for header
  const totalTransfers = flows.reduce((sum, f) => sum + f.count, 0);

  return (
    <Box>
      <Stack spacing={0.5} mb={3} mt={4}>
        <Typography
          sx={{
            color: "#fff",
            fontSize: "16px",
            fontWeight: 600,
            fontFamily: '"SF Pro", sans-serif',
          }}
        >
          Fund Flow Diagram
        </Typography>
        <Typography
          sx={{
            color: "#666",
            fontSize: "12px",
            fontFamily: '"SF Pro", sans-serif',
          }}
        >
          Visual representation of recent money transfers ({totalTransfers}{" "}
          total)
        </Typography>
      </Stack>

      {/* Render each unique flow direction */}
      <Stack spacing={4}>
        {flows.map((flow, index) => {
          // Color logic
          const color = flow.isInflow ? "#03A881" : "#DC2971";
          const connectionColor = flow.isInflow ? "#03A881" : "#DC2971";
          const isLast = index === flows.length - 1;

          return (
            <Box
              key={index}
              sx={{
                position: "relative",
                width: "100%",
                height: "180px", // Increased height for the curve
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                mb: isLast ? 0 : 2,
              }}
            >
              {/* SVG Overlay for Lines */}
              <Box
                component="svg"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <defs>
                  <marker
                    id={`arrow-${index}`}
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill={connectionColor} />
                  </marker>
                </defs>
                {/* 
                    Curve Logic:
                    Start: Right edge of Source Node approx (300, 50)
                    End: Left edge of Target Node approx (End - 300, 130)
                    Using percentages for responsiveness
                 */}
                <path
                  d="M 280 40 C 400 40, 400 140, 520 140"
                  fill="none"
                  stroke={connectionColor}
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                  markerEnd={`url(#arrow-${index})`}
                  vectorEffect="non-scaling-stroke"
                />
              </Box>

              {/* Source Node Card (Top Left) */}
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: "5%",
                  zIndex: 1,
                  backgroundColor: "#1F1C25",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  p: 3,
                  minWidth: "220px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  pb={1}
                  borderBottom="1px solid rgba(255,255,255,0.06)"
                  width="100%"
                  justifyContent="center"
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "1px solid #666",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: "#fff",
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: "#999",
                      fontSize: "12px",
                      fontFamily: '"SF Pro"',
                    }}
                  >
                    Transfer
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "16px",
                    fontFamily: '"SF Pro"',
                    fontWeight: 500,
                  }}
                >
                  {shortenAddress(flow.source)}
                </Typography>

                <Box
                  sx={{
                    bgcolor: `${color}1A`,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "20px",
                  }}
                >
                  <Typography
                    sx={{color: color, fontSize: "13px", fontWeight: 600}}
                  >
                    $
                    {flow.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>

                <Typography sx={{color: "#666", fontSize: "11px"}}>
                  {flow.count} txns
                </Typography>
              </Box>

              {/* Target Node Card (Bottom Right) */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: "10%",
                  zIndex: 1,
                  backgroundColor: "#1F1C25",
                  borderRadius: "16px",
                  border: `1px solid ${color}`,
                  boxShadow: `0px 0px 0px 1px ${color}3D`,
                  p: 3,
                  minWidth: "180px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 0.5,
                  }}
                >
                  <IdenticonImg address={flow.target} />
                </Box>

                <Typography
                  sx={{color: "#fff", fontSize: "14px", fontFamily: '"SF Pro"'}}
                >
                  {shortenAddress(flow.target)}
                </Typography>

                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    px: 1,
                    py: 0.25,
                    borderRadius: "4px",
                  }}
                >
                  <Typography sx={{color: "#999", fontSize: "10px"}}>
                    {flow.targetLabel}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Stack>

      {/* Legend */}
      <Stack direction="row" spacing={3} sx={{mt: 4, flexWrap: "wrap", gap: 1}}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{width: 24, height: 2, backgroundColor: "#03A881"}} />
          <Typography
            sx={{color: "#666", fontSize: "10px", fontFamily: '"SF Pro"'}}
          >
            Inflow (Deposits)
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{width: 24, height: 2, backgroundColor: "#DC2971"}} />
          <Typography
            sx={{color: "#666", fontSize: "10px", fontFamily: '"SF Pro"'}}
          >
            Outflow (Withdrawals)
          </Typography>
        </Stack>
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
            sx={{color: "#666", fontSize: "10px", fontFamily: '"SF Pro"'}}
          >
            Current Address
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#666",
            }}
          />
          <Typography
            sx={{color: "#666", fontSize: "10px", fontFamily: '"SF Pro"'}}
          >
            External Addresses
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
