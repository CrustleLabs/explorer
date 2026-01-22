import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Box from "@mui/material/Box";
import {Typography, Skeleton} from "@mui/material";
import * as RRD from "react-router-dom";
import Button from "@mui/material/Button";
import {Types} from "aptos";
import {getTransactions} from "../../api";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {useAugmentToWithGlobalSearchParams} from "../../routing";
import HashButton, {HashType} from "../../components/HashButton";
import {TransactionStatus} from "../../components/TransactionStatus";
import {
  DexPayload,
  getSideLabel,
  calculatePriceAndSize,
  extractBaseToken,
} from "../../utils/dex";
import {useGetPerpetuals} from "../../api/hooks/useGetPerpetuals";
import {Side} from "@aptos-labs/ts-sdk";
import {grey, aptosColor} from "../../themes/colors/aptosColorPalette";
import BTCIcon from "../../assets/svg/perps/btc.svg?react";
import ETHIcon from "../../assets/svg/perps/eth.svg?react";
import SettingsIcon from "@mui/icons-material/Settings";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const PREVIEW_LIMIT = 10;

// Card container styling matching Figma
const cardSx = {
  backgroundColor: "#16141A",
  borderRadius: "24px",
  border: "0.5px solid rgba(255,255,255,0.06)",
  p: 3,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  height: "100%",
};

// View all link styling
const viewAllLinkSx = {
  color: "#CDB9F9",
  fontSize: "14px",
  fontFamily: '"SF Pro", system-ui, sans-serif',
  textDecoration: "none",
  cursor: "pointer",
  transition: "opacity 0.2s",
  "&:hover": {
    opacity: 0.8,
  },
  textTransform: "none",
};

// Table header styling
const headerCellSx = {
  color: "#666",
  fontSize: "12px",
  fontFamily: '"SF Pro", sans-serif',
  textTransform: "uppercase" as const,
  py: 1.5,
};

// Table row styling
const rowSx = {
  display: "grid",
  gridTemplateColumns: "1.2fr 2fr 0.8fr",
  gap: 2,
  py: 1.5,
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  "&:last-child": {
    borderBottom: "none",
  },
};

// Cell styling
const cellSx = {
  color: "#fff",
  fontSize: "13px",
  fontFamily: '"SF Pro", sans-serif',
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
};

// System user badge component (similar to HashButton but without copy button)
function SystemUserBadge({label}: {label: "Validator" | "System"}) {
  const isValidator = label === "Validator";

  return (
    <Box
      sx={{
        backgroundColor: "rgba(182,146,244,0.16)",
        border: "0.5px solid rgba(217,203,251,0.12)",
        color: "#FFF",
        padding: "4px 8px 4px 4px",
        borderRadius: "100px",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: isValidator
            ? "rgba(102, 75, 158, 0.5)"
            : "rgba(100, 100, 100, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isValidator ? (
          <VerifiedUserIcon sx={{fontSize: 12, color: "#B692F4"}} />
        ) : (
          <SettingsIcon sx={{fontSize: 12, color: grey[400]}} />
        )}
      </Box>
      <Typography
        component="span"
        sx={{
          color: "#fff",
          fontSize: "14px",
          fontFamily: '"SF Pro", sans-serif',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

// Get action details from transaction
function getActionDetails(transaction: Types.Transaction): {
  action: string;
  details: string;
} {
  if ("payload" in transaction && transaction.payload) {
    const payload = transaction.payload;
    if ("function" in payload && typeof payload.function === "string") {
      const funcInfo = payload.function;
      const parts = funcInfo.split("::");
      const action = parts[parts.length - 1] || "Unknown";
      return {action, details: funcInfo};
    }
  }
  // For non-user transactions, show the type
  if ("type" in transaction) {
    const type = transaction.type as string;
    if (type === "state_checkpoint_transaction")
      return {action: "Checkpoint", details: ""};
    if (type === "block_metadata_transaction")
      return {action: "Block Metadata", details: ""};
    return {action: type.replace(/_/g, " "), details: ""};
  }
  return {action: "Unknown", details: ""};
}

// Helper component to display order info (matching TransactionsTable)
function OrderInfoDisplay({
  order,
  perpetuals,
  showCount,
  orderCount,
}: {
  order: NonNullable<DexPayload["orders"]>[0];
  perpetuals: ReturnType<typeof useGetPerpetuals>["data"];
  showCount?: boolean;
  orderCount?: number;
}) {
  const perpetual = perpetuals?.[order.symbol_id];
  if (!perpetual) return <Typography sx={{color: grey[450]}}>--</Typography>;

  const sideInfo = getSideLabel(order.side as Side, order.reduce_only);
  const baseToken = extractBaseToken(perpetual.ticker);
  const {price, size} = calculatePriceAndSize(order, perpetual);
  const notionalValue = price * size;

  // Format value: $10.93K, $1.2M, etc.
  const formatValue = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <Box
      sx={{display: "flex", alignItems: "center", gap: 0.5, flexWrap: "nowrap"}}
    >
      {showCount && orderCount && orderCount > 1 && (
        <Typography
          component="span"
          sx={{color: aptosColor, fontWeight: 600, fontSize: "13px"}}
        >
          {orderCount}
        </Typography>
      )}
      <Typography component="span" sx={{color: grey[450], fontSize: "13px"}}>
        Orders /
      </Typography>
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 14,
          height: 14,
        }}
      >
        {baseToken === "BTC" ? (
          <BTCIcon width={14} height={14} />
        ) : baseToken === "ETH" ? (
          <ETHIcon width={14} height={14} />
        ) : (
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#F7931A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "8px",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {baseToken.charAt(0)}
          </Box>
        )}
      </Box>
      <Typography
        component="span"
        sx={{color: sideInfo.color, fontWeight: 600, fontSize: "13px"}}
      >
        {sideInfo.label}
      </Typography>
      <Typography component="span" sx={{color: "#fff", fontSize: "13px"}}>
        {baseToken}
      </Typography>
      <Typography component="span" sx={{color: "#fff", fontSize: "13px"}}>
        {formatValue(notionalValue)}
      </Typography>
    </Box>
  );
}

// System transaction action labels
const SYSTEM_TX_ACTIONS: Record<string, string> = {
  block_metadata_transaction: "New Block",
  block_epilogue_transaction: "Block Finalized",
  validator_transaction: "Validator Action",
};

// Get system transaction action label
function getSystemTxAction(transaction: Types.Transaction): string {
  // Special case for Oracle Price Update
  if (
    transaction.type === "validator_transaction" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (transaction as any).validator_transaction_type === "oracle_price"
  ) {
    return "Oracle Price Update";
  }
  return SYSTEM_TX_ACTIONS[transaction.type as string] || "System Action";
}

// Action Details Cell component
function ActionDetailsCell({
  transaction,
  perpetuals,
  augmentTo,
}: {
  transaction: Types.Transaction;
  perpetuals: ReturnType<typeof useGetPerpetuals>["data"];
  augmentTo: (path: string) => string;
}) {
  const {action} = getActionDetails(transaction);

  // Block Metadata, Block Epilogue, and Validator transactions show specific actions
  if (
    transaction.type === "block_metadata_transaction" ||
    transaction.type === "block_epilogue_transaction" ||
    transaction.type === "validator_transaction"
  ) {
    const systemAction = getSystemTxAction(transaction);
    return (
      <Typography sx={{color: grey[450], fontSize: "13px"}}>
        {systemAction}
      </Typography>
    );
  }

  // Check if this is a dex_orderless_payload transaction
  const payload =
    "payload" in transaction
      ? (transaction as Types.UserTransaction).payload
      : null;
  const dexPayload = payload as DexPayload | null;
  const orders = dexPayload?.orders;
  const isDexOrder =
    dexPayload?.type === "dex_orderless_payload" && orders && orders.length > 0;

  if (isDexOrder && dexPayload?.orders) {
    const orders = dexPayload.orders;
    const firstOrder = orders[0];

    return (
      <OrderInfoDisplay
        order={firstOrder}
        perpetuals={perpetuals}
        showCount={orders.length > 1}
        orderCount={orders.length}
      />
    );
  }

  // Fallback: show action name linking to transaction
  return (
    <RRD.Link
      to={augmentTo(
        `/txn/${"version" in transaction ? transaction.version : ""}`,
      )}
      style={{
        color: "#fff",
        textDecoration: "none",
        fontSize: "13px",
      }}
    >
      {action}
    </RRD.Link>
  );
}

export default function RecentTransactions() {
  const [isHovered, setIsHovered] = useState(false);
  const [state] = useGlobalState();
  const augmentTo = useAugmentToWithGlobalSearchParams();
  const {data: perpetuals} = useGetPerpetuals();

  const {data: transactions, isLoading} = useQuery({
    queryKey: ["recentTransactions", state.network_value],
    queryFn: () => getTransactions({limit: PREVIEW_LIMIT}, state.aptos_client),
    refetchInterval: isHovered ? 0 : 5000,
  });

  return (
    <Box
      sx={cardSx}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          fontSize: "20px",
          fontWeight: 600,
          fontFamily: '"SF Pro", sans-serif',
        }}
      >
        Recent Transactions
      </Typography>

      {/* Table Header */}
      <Box sx={rowSx}>
        <Typography sx={headerCellSx}>User</Typography>
        <Typography sx={headerCellSx}>Action / Details</Typography>
        <Typography sx={{...headerCellSx, textAlign: "right"}}>
          Status
        </Typography>
      </Box>

      {/* Table Body */}
      <Box sx={{flex: 1, overflowY: "auto"}}>
        {isLoading || !transactions
          ? // Skeleton loading
            Array.from({length: PREVIEW_LIMIT}).map((_, i) => (
              <Box key={i} sx={rowSx}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={60} />
              </Box>
            ))
          : transactions.map(
              (transaction: Types.Transaction, index: number) => {
                const sender =
                  "sender" in transaction ? transaction.sender : undefined;
                const success =
                  "success" in transaction ? transaction.success : true;

                // Determine user display for system transactions
                const isBlockMetadata =
                  transaction.type === "block_metadata_transaction";
                const isBlockEpilogue =
                  transaction.type === "block_epilogue_transaction";
                const isValidatorTx =
                  transaction.type === "validator_transaction";
                const isSystemTx =
                  isBlockMetadata || isBlockEpilogue || isValidatorTx;

                // Get system user label
                const getSystemUserLabel = ():
                  | "Validator"
                  | "System"
                  | null => {
                  if (isBlockMetadata || isValidatorTx) return "Validator";
                  if (isBlockEpilogue) return "System";
                  return null;
                };
                const systemUserLabel = getSystemUserLabel();

                return (
                  <Box key={index} sx={rowSx}>
                    {/* User Column */}
                    <Box sx={cellSx}>
                      {sender ? (
                        <HashButton
                          hash={sender}
                          type={HashType.ACCOUNT}
                          size="small"
                        />
                      ) : isSystemTx && systemUserLabel ? (
                        <SystemUserBadge label={systemUserLabel} />
                      ) : null}
                    </Box>

                    {/* Action / Details Column */}
                    <Box sx={cellSx}>
                      <ActionDetailsCell
                        transaction={transaction}
                        perpetuals={perpetuals}
                        augmentTo={augmentTo}
                      />
                    </Box>

                    {/* Status Column */}
                    <Box sx={{...cellSx, justifyContent: "flex-end"}}>
                      <TransactionStatus success={success} />
                    </Box>
                  </Box>
                );
              },
            )}
      </Box>

      {/* View All Link */}
      <Box sx={{display: "flex", justifyContent: "center", pt: 1}}>
        <Button
          component={RRD.Link}
          to={augmentTo("/transactions")}
          sx={viewAllLinkSx}
        >
          {"< View all transactions >"}
        </Button>
      </Box>
    </Box>
  );
}
