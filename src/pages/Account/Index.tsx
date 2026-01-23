import {useParams} from "react-router-dom";
import {Box, Grid, Typography} from "@mui/material";
import React, {useEffect} from "react";
import AccountOverviewTab from "./Tabs/AccountOverviewTab";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {BackButton} from "../../components/GoBack";
import UnifiedPageHeader from "../../components/UnifiedPageHeader";
import LoadingModal from "../../components/LoadingModal";
import Error from "./Error";
import {AptosNamesBanner} from "./Components/AptosNamesBanner";
import {PetraVaultBanner} from "./Components/PetraVaultBanner";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {Network} from "aptos";
import {useGetAccountType} from "../../api/hooks/useGetAccountType";
import {AccountAddress} from "@aptos-labs/ts-sdk";
import {useNavigate} from "../../routing";
import {ResponseError, ResponseErrorType} from "../../api/client";
import {useGetAddressFromName} from "../../api/hooks/useGetANS";

type AccountPageProps = {
  isObject?: boolean;
};

export function accountPagePath(isObject: boolean) {
  if (isObject) {
    return "object";
  }
  return "account";
}

export default function AccountPage({
  isObject: alreadyIsObject,
}: AccountPageProps) {
  const navigate = useNavigate();
  const maybeAddress = useParams().address;

  // Check if this is an ANS name
  const isAptName = maybeAddress?.endsWith(".apt");
  const ansQuery = useGetAddressFromName(isAptName ? maybeAddress || "" : "");

  let address: string = "";
  let addressError: ResponseError | null = null;

  if (maybeAddress) {
    if (isAptName) {
      // Handle ANS name resolution
      if (ansQuery.isLoading) {
        // Still loading ANS resolution, keep address empty for now
        address = "";
      } else if (ansQuery.data) {
        // Successfully resolved ANS name
        address = ansQuery.data;
      } else if (ansQuery.isError || (!ansQuery.isLoading && !ansQuery.data)) {
        // ANS resolution failed
        addressError = {
          type: ResponseErrorType.NOT_FOUND,
          message: `ANS name '${maybeAddress}' not found`,
        };
      }
    } else {
      // Handle regular address
      try {
        address = AccountAddress.from(maybeAddress, {
          maxMissingChars: 63,
        }).toStringLong();
      } catch {
        addressError = {
          type: ResponseErrorType.INVALID_INPUT,
          message: `Invalid address '${maybeAddress}'`,
        };
      }
    }
  }

  const {
    data: accountTypeData,
    error: resourceError,
    isLoading: resourcesIsLoading,
  } = useGetAccountType(address);

  const isAccount = accountTypeData?.isAccount ?? false;
  const isObject = accountTypeData?.isObject ?? false;
  const isMultisig = accountTypeData?.isMultisig ?? false;
  const accountData = accountTypeData?.accountData;

  const isLoading = resourcesIsLoading || (!!isAptName && ansQuery.isLoading);
  let error: ResponseError | null = null;
  if (addressError) {
    // If the address is not found, we can still show the account page, without an error
    if (addressError.type === ResponseErrorType.NOT_FOUND) {
      error = resourceError;
    } else {
      error = addressError;
    }
  } else if (resourceError) {
    error = resourceError;
  }

  useEffect(() => {
    // If we are on the account page, we might be loading an object. This
    // handler will redirect to the object page if no account exists but an
    // object does.
    if (!isLoading) {
      // TODO: Handle where it's both an object and an account
      if (!alreadyIsObject && isObject && !isAccount) {
        navigate(`/object/${address}`, {replace: true});
      }
    }

    // If we successfully resolved an ANS name and have an address,
    // optionally redirect to the address URL for clean URLs
    // (This is optional - you may want to keep the ANS name in the URL)
    // if (isAptName && address && !isLoading && maybeAddress !== address) {
    //   const currentPath = window.location.pathname;
    //   const newPath = currentPath.replace(`/account/${maybeAddress}`, `/account/${address}`);
    //   navigate(newPath, { replace: true });
    // }
  }, [
    address,
    alreadyIsObject,
    isObject,
    isLoading,
    accountData,
    navigate,
    isAccount,
    isAptName,
    maybeAddress,
  ]);

  const [state] = useGlobalState();

  return (
    <Grid container spacing={2}>
      <LoadingModal open={isLoading} />

      {/* Back Button */}
      <Grid size={{xs: 12}}>
        <BackButton handleClick={() => navigate(-1)} />
      </Grid>

      {/* Unified Header */}
      <Grid size={{xs: 12}}>
        <UnifiedPageHeader title="Account Details" />
      </Grid>

      {/* Address Pill */}
      <Grid size={{xs: 12}}>
        {(() => {
          // Convert Aptos address (66 chars) to EVM address (42 chars)
          // EVM address is the last 40 hex chars + 0x prefix
          const evmAddress = address ? `0x${address.slice(-40)}` : "";
          const displayAddress = evmAddress
            ? `${evmAddress.substring(0, 6)}...${evmAddress.substring(evmAddress.length - 4)}`
            : "";

          return (
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: "100px",
                px: 2,
                py: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                },
              }}
              onClick={() => {
                if (evmAddress) navigator.clipboard.writeText(evmAddress);
              }}
            >
              {/* Avatar placeholder */}
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #CDB9F9 0%, #8FC7FA 100%)",
                }}
              />
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: "monospace",
                }}
              >
                {displayAddress}
              </Typography>
              <ContentCopyIcon sx={{fontSize: 14, color: "#666"}} />
            </Box>
          );
        })()}
      </Grid>

      {/* Portfolio Dashboard Content */}
      <Grid size={{xs: 12}} sx={{mt: 3}}>
        <AccountOverviewTab address={address} />
      </Grid>

      {/* Banners */}
      <Grid size={{xs: 12}} sx={{mt: 4}}>
        {state.network_name === Network.MAINNET && <AptosNamesBanner />}
        {isMultisig && <PetraVaultBanner address={address} />}
      </Grid>

      {/* Error display if any */}
      {error && (
        <Grid size={{xs: 12}} sx={{mt: 4}}>
          <Error address={address} error={error} />
        </Grid>
      )}
    </Grid>
  );
}
