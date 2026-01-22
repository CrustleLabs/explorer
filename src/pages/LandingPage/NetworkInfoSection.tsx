import {Box, Typography} from "@mui/material";
import {useGlobalState} from "../../global-config/GlobalConfig";
import SkeletonBlock from "../../components/SkeletonBlock";
import {useQuery} from "@tanstack/react-query";
import {getLedgerInfo} from "../../api";

export default function NetworkInfoSection() {
  const [state] = useGlobalState();

  // Total Transactions
  const {data: ledgerData} = useQuery({
    queryKey: ["ledgerInfo", state.network_value],
    queryFn: () => getLedgerInfo(state.aptos_client),
    refetchInterval: 10000,
  });
  const ledgerVersion = ledgerData?.ledger_version;

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
    </Box>
  );
}
