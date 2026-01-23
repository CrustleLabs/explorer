import {useState, useEffect, useRef, useCallback, memo} from "react";
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
import AvatarIcon from "../../assets/svg/avatar.svg?react";
import GearIcon from "../../assets/svg/gear.svg?react";

const PREVIEW_LIMIT = 10;
const MAX_ACCUMULATED_TXS = 30; // Maximum transactions to keep in memory (reduced for performance)

// Card container styling matching Figma
const cardSx = {
  backgroundColor: "rgba(31, 28, 37, 0.6)",
  borderRadius: "24px",
  border: "0.5px solid rgba(255,255,255,0.12)",
  py: 3,
  px: 0,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "clip",
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
  fontSize: "14px",
  fontFamily: '"SF Pro", sans-serif',
  fontWeight: 400,
};

// Table row styling (for header)
const headerRowSx = {
  display: "grid",
  gridTemplateColumns: "200px 1fr 100px",
  gap: 2,
  px: 3,
  mt: 2.5, // 20px margin top
  mb: 1.5, // 12px margin bottom
  alignItems: "center",
};

// Clickable row styling (for data rows) - matching Figma chart_list
const clickableRowSx = {
  display: "grid",
  gridTemplateColumns: "200px 1fr 100px",
  gap: 2,
  px: 1.5, // 12px
  py: "10px",
  flexShrink: 0,
  alignItems: "center",
  backgroundColor: "rgba(35, 34, 39, 0.6)",
  borderRadius: "24px",
  cursor: "pointer",
  transition: "background-color 0.15s ease",
  "&:hover": {
    backgroundColor: "rgba(50, 48, 55, 0.8)",
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

// System user badge component matching Figma design
const SystemUserBadge = memo(function SystemUserBadge({
  label,
}: {
  label: "Validator" | "System";
}) {
  const isValidator = label === "Validator";

  return (
    <Box
      sx={{
        backgroundColor: "rgba(182,146,244,0.16)",
        border: "0.5px solid rgba(217,203,251,0.12)",
        borderRadius: "40px",
        height: "28px",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        p: "4px",
      }}
    >
      {isValidator ? (
        // Validator: avatar icon directly 20x20
        <Box
          sx={{
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AvatarIcon width={20} height={20} />
        </Box>
      ) : (
        // System: dark background circle with gear icon
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "29px",
            backgroundColor: "#16141A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <GearIcon width={16} height={16} />
        </Box>
      )}
      <Typography
        component="span"
        sx={{
          color: "#fff",
          fontSize: "12px",
          fontFamily: '"SF Pro", sans-serif',
          fontWeight: 400,
          lineHeight: "16px",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
});

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
const OrderInfoDisplay = memo(function OrderInfoDisplay({
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
  const perpetual = perpetuals?.find((p) => p.perpetual_id === order.symbol_id);
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
});

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
const ActionDetailsCell = memo(function ActionDetailsCell({
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
});

// Helper to get transaction version as unique key
function getTxVersion(tx: Types.Transaction): string {
  return "version" in tx ? tx.version : `${tx.type}-${Math.random()}`;
}

export default function RecentTransactions() {
  const [isHovered, setIsHovered] = useState(false);
  const [state] = useGlobalState();
  const augmentTo = useAugmentToWithGlobalSearchParams();
  const navigate = RRD.useNavigate();
  const {data: perpetuals} = useGetPerpetuals();

  // Accumulated transactions state
  const [accumulatedTxs, setAccumulatedTxs] = useState<Types.Transaction[]>([]);
  const seenVersions = useRef<Set<string>>(new Set());
  const isInitialLoad = useRef(true);

  const {data: transactions, isLoading} = useQuery({
    queryKey: ["recentTransactions", state.network_value],
    queryFn: () => getTransactions({limit: PREVIEW_LIMIT}, state.aptos_client),
    refetchInterval: isHovered ? 0 : 5000,
  });

  // Accumulate new transactions
  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    if (isInitialLoad.current) {
      // First load: set initial transactions
      const versions = transactions.map(getTxVersion);
      seenVersions.current = new Set(versions);
      setAccumulatedTxs(transactions);
      isInitialLoad.current = false;
    } else {
      // Subsequent loads: prepend new transactions
      const newTxs = transactions.filter((tx) => {
        const version = getTxVersion(tx);
        return !seenVersions.current.has(version);
      });

      if (newTxs.length > 0) {
        newTxs.forEach((tx) => seenVersions.current.add(getTxVersion(tx)));
        setAccumulatedTxs((prev) => {
          const combined = [...newTxs, ...prev];
          // Keep max accumulated transactions
          if (combined.length > MAX_ACCUMULATED_TXS) {
            const removed = combined.slice(MAX_ACCUMULATED_TXS);
            removed.forEach((tx) =>
              seenVersions.current.delete(getTxVersion(tx)),
            );
            return combined.slice(0, MAX_ACCUMULATED_TXS);
          }
          return combined;
        });
      }
    }
  }, [transactions]);

  // Reset when network changes
  useEffect(() => {
    isInitialLoad.current = true;
    seenVersions.current.clear();
    setAccumulatedTxs([]);
  }, [state.network_value]);

  // Handle row click navigation
  const handleRowClick = useCallback(
    (transaction: Types.Transaction) => {
      if ("version" in transaction) {
        navigate(augmentTo(`/txn/${transaction.version}`));
      }
    },
    [navigate, augmentTo],
  );

  return (
    <Box
      sx={cardSx}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title */}
      <Typography
        sx={{
          color: "#fff",
          fontSize: "24px",
          fontWeight: 700,
          fontFamily: '"SF Pro", sans-serif',
          lineHeight: "28px",
          px: 3,
        }}
      >
        Recent Transactions
      </Typography>

      {/* Table Header */}
      <Box sx={headerRowSx}>
        <Typography sx={headerCellSx}>User</Typography>
        <Typography sx={headerCellSx}>Action / Details</Typography>
        <Typography sx={{...headerCellSx, textAlign: "right"}}>
          Status
        </Typography>
      </Box>

      {/* Table Body */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1, // 8px gap between rows
          px: 1.5, // 12px padding
          // Custom Scrollbar
          // Custom Scrollbar
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            marginTop: "4px",
            marginBottom: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#3C3C41", // Darker simplified thumb
            borderRadius: "10px",
            border:
              "4px solid rgba(0,0,0,0)" /* Creates 4px spacing/padding around thumb */,
            backgroundClip: "padding-box",
            "&:hover": {
              background: "#4C4C51",
              border: "4px solid rgba(0,0,0,0)",
              backgroundClip: "padding-box",
            },
          },
        }}
      >
        {isLoading || accumulatedTxs.length === 0
          ? // Skeleton loading
            Array.from({length: PREVIEW_LIMIT}).map((_, i) => (
              <Box key={i} sx={{...clickableRowSx, cursor: "default"}}>
                <Skeleton
                  variant="rounded"
                  width={90}
                  height={28}
                  sx={{borderRadius: "40px"}}
                />
                <Skeleton variant="text" width={200} />
                <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                  <Skeleton
                    variant="rounded"
                    width={70}
                    height={26}
                    sx={{borderRadius: "37px"}}
                  />
                </Box>
              </Box>
            ))
          : accumulatedTxs.map((transaction: Types.Transaction) => {
              const version = getTxVersion(transaction);
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
              const getSystemUserLabel = (): "Validator" | "System" | null => {
                if (isBlockMetadata || isValidatorTx) return "Validator";
                if (isBlockEpilogue) return "System";
                return null;
              };
              const systemUserLabel = getSystemUserLabel();

              return (
                <Box
                  key={version}
                  sx={clickableRowSx}
                  onClick={() => handleRowClick(transaction)}
                >
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
            })}
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
