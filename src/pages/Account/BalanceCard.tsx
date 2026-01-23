import React, {useState, useEffect} from "react";
import {Box, Link, Stack, Typography} from "@mui/material";
import {getFormattedBalanceStr} from "../../components/IndividualPageContent/ContentValue/CurrencyValue";
import StyledTooltip from "../../components/StyledTooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {useGetAccountAPTBalance} from "../../api/hooks/useGetAccountAPTBalance";
import {getPrice} from "../../api/hooks/useGetPrice";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {OpenInNew} from "@mui/icons-material";

type BalanceCardProps = {
  address: string;
};

export default function BalanceCard({address}: BalanceCardProps) {
  const balance = useGetAccountAPTBalance(address);
  const [globalState] = useGlobalState();
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const fetchedPrice = await getPrice();
        setPrice(fetchedPrice);
      } catch (error) {
        console.error("Error fetching APT price:", error);
        setPrice(null);
      }
    };

    fetchPrice();
  }, []);

  const balanceUSD =
    balance.data && price !== null
      ? (Number(balance.data) * Number(price)) / 10e7
      : null;

  return balance.data ? (
    <Box
      sx={{
        backgroundColor: "#16141A",
        borderRadius: "24px",
        border: "0.5px solid rgba(255,255,255,0.12)",
        p: 3,
        height: "fit-content",
      }}
    >
      <Stack spacing={1.5}>
        {/* APT balance - large text */}
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: 700,
            fontFamily: '"SF Pro", sans-serif',
            color: "#fff",
          }}
        >
          {`${getFormattedBalanceStr(balance.data)} APT`}
        </Typography>

        {/* Balance label with info icon */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            sx={{
              fontSize: "12px",
              color: "#666",
              fontFamily: '"SF Pro", sans-serif',
            }}
          >
            Balance
          </Typography>
          <StyledTooltip
            title={`This balance reflects the amount of APT tokens held in your wallet${globalState.network_name === "mainnet" ? ` and their live value in USD at a rate of 1 APT = $${price?.toFixed(2)}` : ""}.`}
          >
            <InfoOutlinedIcon sx={{fontSize: 14, color: "#666"}} />
          </StyledTooltip>
        </Stack>

        {/* USD value - only show on mainnet */}
        {globalState.network_name === "mainnet" && balanceUSD !== null && (
          <Typography
            sx={{
              fontSize: "14px",
              color: "#999",
              fontFamily: '"SF Pro", sans-serif',
            }}
          >
            ${balanceUSD.toLocaleString(undefined, {maximumFractionDigits: 2})}{" "}
            USD
          </Typography>
        )}

        {/* DeFi link */}
        <Link
          href={`https://aptos.lightscan.one/portfolio/${address}`}
          underline="none"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontSize: "12px",
            color: "#CDB9F9",
            fontFamily: '"SF Pro", sans-serif',
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            "&:hover": {
              color: "#B692F4",
            },
          }}
        >
          DeFi positions on Lightscan <OpenInNew sx={{fontSize: 12}} />
        </Link>
      </Stack>
    </Box>
  ) : null;
}
