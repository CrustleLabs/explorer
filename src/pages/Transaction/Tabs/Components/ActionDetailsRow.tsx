import React from "react";
import {Box, Stack, Typography} from "@mui/material";
import {Types} from "aptos";
import {useGetPerpetuals} from "../../../../api/hooks/useGetPerpetuals";
import {
  DexPayload,
  calculatePriceAndSize,
  extractBaseToken,
  getSideLabel,
  positiveColor,
} from "../../../../utils/dex";
import {useGetDexAccount} from "../../../../api/hooks/useGetDexAccount";
import {useGetLeverageTiers} from "../../../../api/hooks/useGetLeverageTiers";
import BTCIcon from "../../../../assets/svg/perps/btc.svg?react";

interface ActionDetailsRowProps {
  transaction: Types.Transaction;
}

export default function ActionDetailsRow({transaction}: ActionDetailsRowProps) {
  const {data: perpetuals, isLoading: isPerpsLoading} = useGetPerpetuals();
  const {data: leverageTiersMap} = useGetLeverageTiers();

  const sender =
    transaction.type === "user_transaction"
      ? (transaction as Types.UserTransaction).sender
      : "";
  const {data: dexAccount} = useGetDexAccount(sender);

  if (
    !("payload" in transaction) ||
    transaction.payload.type !== "dex_payload" ||
    isPerpsLoading ||
    !perpetuals
  ) {
    return null;
  }

  const payload = transaction.payload as unknown as DexPayload;
  const order = payload.orders[0];
  const perpetual = perpetuals.find((p) => p.perpetual_id === order.symbol_id);

  if (!perpetual) return null;

  const getLeverage = () => {
    if (!dexAccount) return null;

    // 1. Check user config
    const subaccountPart = order.subaccount.split("-").pop();
    const subaccountNum = subaccountPart ? parseInt(subaccountPart) : 0;
    const subConfig = dexAccount.subAccountConfigs.find(
      (c) => c.subaccount_number === subaccountNum,
    );
    if (subConfig) {
      const levInfo = subConfig.leverage_infos.find(
        (l) => l.symbol_id === order.symbol_id,
      );
      if (levInfo) return levInfo.leverage;
    }

    // 2. Fallback to max leverage
    if (leverageTiersMap) {
      const tiers = leverageTiersMap.get(perpetual.perpetual_tier);
      if (tiers && tiers.length > 0) {
        const maxLev = Math.max(...tiers.map((t) => t.maxLeverage || 0));
        return maxLev > 0 ? maxLev : 20;
      }
    }
    return 5;
  };

  const leverage = getLeverage();
  const {price, size} = calculatePriceAndSize(order, perpetual);
  const notionalValue = price * size;
  const baseToken = extractBaseToken(perpetual.ticker);
  const sideInfo = getSideLabel(order.side, order.reduce_only);

  // Background color for the tag - using rgba based on side color
  const tagBgColor =
    sideInfo.color === positiveColor
      ? "rgba(3, 168, 129, 0.12)"
      : "rgba(220, 41, 113, 0.12)";

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {/* BTC Token Icon */}
      <Box
        sx={{
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BTCIcon width={20} height={20} />
      </Box>

      {/* Ticker & Price */}
      <Typography
        sx={{
          color: "#fff",
          fontSize: "16px",
          fontWeight: 510,
          fontFamily: '"SF Pro", sans-serif',
          lineHeight: "20px",
        }}
      >
        {baseToken} $
        {notionalValue.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}
      </Typography>

      {/* Side Tag */}
      <Box
        sx={{
          backgroundColor: tagBgColor,
          borderRadius: "74px",
          px: 1,
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: sideInfo.color,
            fontSize: "14px",
            fontWeight: 510,
            fontFamily: '"SF Pro", sans-serif',
            lineHeight: "18px",
          }}
        >
          {sideInfo.label}
        </Typography>
      </Box>

      {/* Leverage */}
      {leverage && (
        <Typography
          sx={{
            color: "#fff",
            fontSize: "14px",
            fontWeight: 510,
            fontFamily: '"SF Pro", sans-serif',
            lineHeight: "18px",
          }}
        >
          {leverage}x
        </Typography>
      )}
    </Stack>
  );
}
