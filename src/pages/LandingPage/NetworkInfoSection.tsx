import {Box, Grid, Typography, Stack, Tooltip} from "@mui/material";
import React from "react";
import {useGlobalState} from "../../global-config/GlobalConfig";
import SkeletonBlock, {
  SkeletonStatsValue,
} from "../../components/SkeletonBlock";
import {useQuery} from "@tanstack/react-query";
import {getLedgerInfo} from "../../api";
import {useGetCoinSupplyLimit} from "../../api/hooks/useGetCoinSupplyLimit";
import {getFormattedBalanceStr} from "../../components/IndividualPageContent/ContentValue/CurrencyValue";
import {APTOS_COIN} from "@aptos-labs/ts-sdk";
import {useGetValidatorSet} from "../../api/hooks/useGetValidatorSet";
import {useGetTPS} from "../../api/hooks/useGetTPS";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Card container styling matching others
const cardSx = {
  backgroundColor: "#16141A",
  borderRadius: "24px",
  border: "0.5px solid rgba(255,255,255,0.06)",
  p: 3,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  justifyContent: "space-between",
  gap: "36px",
};

const labelSx = {
  color: "#fff",
  fontSize: "14px",
  fontFamily: '"SF Pro", sans-serif',
  lineHeight: "18px",
};

const valueSx = {
  color: "#fff",
  fontSize: "32px",
  fontWeight: 700,
  fontFamily: '"Sora", sans-serif',
  lineHeight: "40px",
};

function StatsCard({
  label,
  value,
  tooltip,
  isLoading = false,
}: {
  label: string;
  value: React.ReactNode;
  tooltip?: string;
  isLoading?: boolean;
}) {
  return (
    <Box sx={cardSx}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography sx={labelSx}>{label}</Typography>
        {tooltip && (
          <Tooltip title={tooltip} arrow placement="top">
            <InfoOutlinedIcon sx={{fontSize: 16, color: "#666"}} />
          </Tooltip>
        )}
      </Stack>
      <Box>
        {isLoading ? (
          <SkeletonStatsValue />
        ) : (
          <Typography sx={valueSx}>{value}</Typography>
        )}
      </Box>
    </Box>
  );
}

function formatSupply(value: string | bigint) {
  const intVal = BigInt(value);
  // 1 APT = 10^8 Octas
  const octasPerApt = 100000000n;

  // Thresholds in Octas
  const oneMillionApt = 1000000n * octasPerApt;
  const oneBillionApt = 1000000000n * octasPerApt;

  if (intVal >= oneBillionApt) {
    const aptValue = Number(intVal) / 1e8;
    return `${(aptValue / 1e9).toFixed(2)}B`;
  }

  if (intVal >= oneMillionApt) {
    const aptValue = Number(intVal) / 1e8;
    return `${(aptValue / 1e6).toFixed(2)}M`;
  }

  return getFormattedBalanceStr(value.toString(), undefined, 0);
}

function getFormattedTPS(tps: number) {
  const tpsWithDecimal = parseFloat(tps.toFixed(0));
  return tpsWithDecimal.toLocaleString("en-US");
}

export default function NetworkInfoSection() {
  const [state] = useGlobalState();

  // Total Transactions
  const {data: ledgerData} = useQuery({
    queryKey: ["ledgerInfo", state.network_value],
    queryFn: () => getLedgerInfo(state.aptos_client),
    refetchInterval: 10000,
  });
  const ledgerVersion = ledgerData?.ledger_version;

  // Total Supply
  const {data: supplyData} = useGetCoinSupplyLimit(APTOS_COIN);
  const totalSupply = supplyData?.[0];

  // Total Stake
  const {totalVotingPower} = useGetValidatorSet();

  // TPS
  const {tps} = useGetTPS();

  // Active Nodes (Validators)
  const {numberOfActiveValidators} = useGetValidatorSet();
  // useGetFullnodeCount is imported but not used in this simplified view.

  return (
    <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
      {/* Header Row: Label + Total Count */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="body1" sx={{color: "#999", fontSize: "16px"}}>
          Total Transactions
        </Typography>
        {ledgerVersion ? (
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "24px",
              fontFamily: '"Sora", sans-serif',
            }}
          >
            {parseInt(ledgerVersion).toLocaleString("en-US")}
          </Typography>
        ) : (
          <SkeletonBlock width={120} height={24} />
        )}
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        <Grid size={{xs: 12, md: 3}}>
          <StatsCard
            label="Total Supply"
            value={totalSupply ? formatSupply(totalSupply) : "-"}
            tooltip="Amount of APT tokens flowing through the Settle Network."
            isLoading={!totalSupply}
          />
        </Grid>
        <Grid size={{xs: 12, md: 3}}>
          <StatsCard
            label="Actively Staked"
            value={totalVotingPower ? formatSupply(totalVotingPower) : "-"}
            tooltip="Amount of APT tokens currently held in staking pools."
            isLoading={!totalVotingPower}
          />
        </Grid>
        <Grid size={{xs: 12, md: 3}}>
          <StatsCard
            label="TPS"
            value={tps ? getFormattedTPS(tps) : "-"}
            tooltip="Current rate of transactions per second on the network."
            isLoading={!tps}
          />
        </Grid>
        <Grid size={{xs: 12, md: 3}}>
          <StatsCard
            label="Active Nodes"
            value={
              numberOfActiveValidators
                ? numberOfActiveValidators.toLocaleString("en-US")
                : "-"
            }
            tooltip="Number of validators in the validator set in the current epoch."
            isLoading={!numberOfActiveValidators}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
