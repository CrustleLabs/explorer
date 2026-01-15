import {
  FormControl,
  Select,
  SelectChangeEvent,
  Typography,
  Divider,
} from "@mui/material";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import IconGlobe from "../../assets/svg/icon_globe.svg?react";
import {useTheme} from "@mui/material/styles";
import {Stack} from "@mui/system";
import React from "react";
import {
  useGetChainIdAndCache,
  useGetChainIdCached,
} from "../../api/hooks/useGetNetworkChainIds";
import {hiddenNetworks, NetworkName} from "../../constants";
import {useGlobalState} from "../../global-config/GlobalConfig";

function NetworkAndChainIdCached({
  networkName,
  chainId,
}: {
  networkName: string;
  chainId: string | null;
}) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={3}
      width="100%"
      paddingY={0}
    >
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
        }}
        textTransform="capitalize"
      >
        {networkName}
      </Typography>
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          color: theme.palette.mode === "dark" ? "#999" : "#666",
        }}
      >
        {chainId ?? "…"}
      </Typography>
    </Stack>
  );
}

function NetworkAndChainId({networkName}: {networkName: string}) {
  const chainId = useGetChainIdAndCache(networkName as NetworkName);

  return chainId ? (
    <NetworkAndChainIdCached networkName={networkName} chainId={chainId} />
  ) : null;
}

function NetworkMenuItem({networkName}: {networkName: string}) {
  const chainIdCached = useGetChainIdCached(networkName as NetworkName);
  if (hiddenNetworks.includes(networkName)) {
    return null;
  }

  return chainIdCached ? (
    <NetworkAndChainIdCached
      networkName={networkName}
      chainId={chainIdCached}
    />
  ) : (
    <NetworkAndChainId networkName={networkName} />
  );
}

export default function NetworkSelect() {
  const [state, {selectNetwork}] = useGlobalState();
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent) => {
    const network_name = event.target.value;
    selectNetwork(network_name as NetworkName);
  };

  const visibleNetworkNames = React.useMemo(() => ["devnet"], []);

  return (
    <Box>
      <FormControl size="small">
        <Select
          id="network-select"
          inputProps={{"aria-label": "Select Network"}}
          value={state.network_name}
          onChange={handleChange}
          renderValue={() => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <IconGlobe style={{width: 16, height: 16}} />
            </Box>
          )}
          onClose={() => {
            setTimeout(() => {
              (document.activeElement as HTMLElement)?.blur();
            }, 0);
          }}
          variant="standard"
          disableUnderline
          IconComponent={() => null} // Hide default arrow
          sx={{
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            minWidth: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            background:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.05)",
            border:
              theme.palette.mode === "dark"
                ? "0.5px solid rgba(255,255,255,0.12)"
                : "0.5px solid rgba(0,0,0,0.1)",
            "&:hover": {
              background:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
            },
            "& .MuiSelect-select": {
              padding: "0 !important",
              paddingRight: "0 !important",
              paddingLeft: "0 !important", // Ensure no left padding
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              height: "100%",
            },
            color: "inherit",
          }}
          // dropdown container overrides
          MenuProps={{
            disableScrollLock: true,
            PaperProps: {
              sx: {
                minWidth: 240,
                borderRadius: "12px",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(0,0,0,0.05)",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#16141A" : "#FFFFFF",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                marginTop: 1,
                "& .MuiList-root": {
                  padding: "8px", // Add padding to list container
                },
                "& .MuiMenuItem-root": {
                  fontSize: "14px",
                  padding: "8px 12px",
                  borderRadius: "8px", // Rounded corners for items
                  margin: "2px 0", // Vertical spacing
                  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#121615",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.05)",
                  },
                  "&.Mui-selected": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(205, 185, 249, 0.12)" // Brand purple tint
                        : "rgba(0,0,0,0.05)",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.15)"
                          : "rgba(0,0,0,0.1)",
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem disabled value="" sx={{opacity: "1 !important"}}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={3}
              width="100%"
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  lineHeight: "18px",
                }}
              >
                Network
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "16px",
                  color: "#999",
                }}
              >
                Chain ID
              </Typography>
            </Stack>
          </MenuItem>
          <Divider
            sx={{
              borderColor: "rgba(255,255,255,0.1)",
              margin: "4px 0 8px 0 !important",
            }}
          />

          {visibleNetworkNames.map((networkName) => (
            <MenuItem key={networkName} value={networkName}>
              <NetworkMenuItem networkName={networkName} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
