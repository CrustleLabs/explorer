import * as React from "react";
import {Box, Stack} from "@mui/material";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import GeneralTableRow from "../../components/Table/GeneralTableRow";
import GeneralTableHeaderCell from "../../components/Table/GeneralTableHeaderCell";
import HashButton, {HashType} from "../../components/HashButton";
import SkeletonBlock from "../../components/SkeletonBlock";
import {Types} from "aptos";
import {assertNever} from "../../utils";
import {
  TableTransactionType,
  TransactionTypeName,
} from "../../components/TransactionType";
import {TableTransactionStatus} from "../../components/TransactionStatus";
import {getTableFormattedTimestamp} from "../utils";
import GasFeeValue from "../../components/IndividualPageContent/ContentValue/GasFeeValue";
import {useGetTransaction} from "../../api/hooks/useGetTransaction";
import TransactionTypeTooltip from "./Components/TransactionTypeTooltip";
import {APTCurrencyValue} from "../../components/IndividualPageContent/ContentValue/CurrencyValue";
import GeneralTableCell from "../../components/Table/GeneralTableCell";
import GeneralTableBody from "../../components/Table/GeneralTableBody";
import {
  grey,
  negativeColor,
  aptosColor,
} from "../../themes/colors/aptosColorPalette";
import TransactionFunction from "../Transaction/Tabs/Components/TransactionFunction";
import {
  getCoinBalanceChangeForAccount,
  getTransactionAmount,
  getTransactionCounterparty,
} from "../Transaction/utils";
import {Link} from "../../routing";
import {ArrowForwardOutlined, TextSnippetOutlined} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import {
  DexPayload,
  getSideLabel,
  calculatePriceAndSize,
  extractBaseToken,
} from "../../utils/dex";
import {useGetPerpetuals} from "../../api/hooks/useGetPerpetuals";
import {Side} from "@aptos-labs/ts-sdk";
import BTCIcon from "../../assets/svg/perps/btc.svg?react";
import ETHIcon from "../../assets/svg/perps/eth.svg?react";

type TransactionCellProps = {
  transaction: Types.Transaction;
  address?: string;
};

function SequenceNumberCell({transaction}: TransactionCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "left"}}>
      {"sequence_number" in transaction && transaction.sequence_number}
    </GeneralTableCell>
  );
}

function TransactionVersionStatusCell({transaction}: TransactionCellProps) {
  // Keeping for backward compatibility if used elsewhere, but ideally should be replaced
  return (
    <GeneralTableCell sx={{textAlign: "left"}}>
      <Stack direction="row" spacing={0.5}>
        <Link
          to={`/txn/${"version" in transaction && transaction.version}`}
          color="primary"
          underline="none"
        >
          {"version" in transaction && transaction.version}
        </Link>
        {"success" in transaction && (
          <TableTransactionStatus success={transaction.success} />
        )}
      </Stack>
    </GeneralTableCell>
  );
}

function TransactionVersionCell({transaction}: TransactionCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "left"}}>
      <Link
        to={`/txn/${"version" in transaction && transaction.version}`}
        color="primary"
        underline="none"
        sx={{
          color: aptosColor,
          fontSize: "14px",
        }}
      >
        {"version" in transaction && transaction.version}
      </Link>
    </GeneralTableCell>
  );
}

function TransactionStatusCell({transaction}: TransactionCellProps) {
  if (!("success" in transaction))
    return <GeneralTableCell>-</GeneralTableCell>;

  const success = transaction.success;
  return (
    <GeneralTableCell>
      <Box
        sx={{
          backgroundColor: success
            ? "rgba(3, 168, 129, 0.12)"
            : "rgba(220, 41, 113, 0.12)",
          border: success
            ? "1px solid rgba(3, 168, 129, 0.2)"
            : "1px solid rgba(220, 41, 113, 0.2)",
          borderRadius: "100px",
          padding: "2px 12px",
          color: success ? "#03A881" : "#DC2971",
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: '"SF Pro", sans-serif',
          textAlign: "center",
          display: "inline-block",
          lineHeight: "20px",
        }}
      >
        {success ? "Success" : "Failed"}
      </Box>
    </GeneralTableCell>
  );
}

function TransactionHashCell({transaction}: TransactionCellProps) {
  return (
    <GeneralTableCell>
      {"hash" in transaction && (
        <HashButton hash={transaction.hash} type={HashType.TRANSACTION} />
      )}
    </GeneralTableCell>
  );
}

function TransactionTypeCell({transaction}: TransactionCellProps) {
  return (
    <GeneralTableCell>
      {<TableTransactionType type={transaction.type} />}
    </GeneralTableCell>
  );
}

function TransactionTimestampCell({transaction}: TransactionCellProps) {
  const timestamp =
    "timestamp" in transaction ? (
      getTableFormattedTimestamp(transaction.timestamp)
    ) : (
      // Genesis transaction
      <Typography variant="subtitle2" align="center">
        -
      </Typography>
    );

  return (
    <GeneralTableCell sx={{textAlign: "right"}}>{timestamp}</GeneralTableCell>
  );
}

function TransactionSenderCell({transaction}: TransactionCellProps) {
  let sender;
  if (transaction.type === TransactionTypeName.User) {
    sender = (transaction as Types.UserTransaction).sender;
  } else if (transaction.type === "block_metadata_transaction") {
    sender = (transaction as Types.BlockMetadataTransaction).proposer;
  }

  return (
    <GeneralTableCell>
      {sender && <HashButton hash={sender} type={HashType.ACCOUNT} />}
    </GeneralTableCell>
  );
}

function TransactionReceiverOrCounterPartyCell({
  transaction,
}: TransactionCellProps) {
  const counterparty = getTransactionCounterparty(transaction);
  // TODO: Look into adding a different column for smart contract, so it doesn't get confused with the receiver.
  return (
    <GeneralTableCell>
      {counterparty && (
        <Box
          sx={{display: "flex", fontSize: "inherit", alignItems: "row", gap: 1}}
        >
          {counterparty.role === "smartContract" ? (
            <Tooltip title={"Smart Contract"} placement="top">
              <TextSnippetOutlined sx={{position: "relative", top: 2}} />
            </Tooltip>
          ) : (
            <Tooltip title={"Receiver"} placement="top">
              <ArrowForwardOutlined sx={{position: "relative", top: 2}} />
            </Tooltip>
          )}
          <span>
            <HashButton hash={counterparty.address} type={HashType.ACCOUNT} />
          </span>
        </Box>
      )}
    </GeneralTableCell>
  );
}

function TransactionFunctionCell({transaction}: TransactionCellProps) {
  return (
    <GeneralTableCell
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      <TransactionFunction
        transaction={transaction}
        sx={{maxWidth: {xs: 200, md: 300, lg: 400}}}
      />
    </GeneralTableCell>
  );
}

function TransactionAmount({
  transaction,
  address,
}: {
  transaction: Types.Transaction;
  address?: string;
}) {
  if (address !== undefined) {
    const amount = getCoinBalanceChangeForAccount(transaction, address);
    if (amount !== undefined) {
      let amountAbs = amount;
      let color = undefined;
      if (amount > 0) {
        color = aptosColor;
      } else if (amount < 0) {
        color = negativeColor;
        amountAbs = -amount;
      }

      return (
        <Box sx={{color: color}}>
          {amount > 0 && <>+</>}
          {amount < 0 && <>-</>}
          <APTCurrencyValue amount={amountAbs.toString()} />
        </Box>
      );
    }
  } else {
    const amount = getTransactionAmount(transaction);
    if (amount !== undefined) {
      return (
        <Box>
          <APTCurrencyValue amount={amount.toString()} />
        </Box>
      );
    }
  }

  return null;
}

function TransactionAmountGasCell({
  transaction,
  address,
}: TransactionCellProps) {
  return (
    <GeneralTableCell sx={{paddingY: 1}}>
      <Stack sx={{textAlign: "right"}}>
        <TransactionAmount transaction={transaction} address={address} />
        <Box sx={{fontSize: 11, color: grey[450]}}>
          {"gas_used" in transaction && "gas_unit_price" in transaction ? (
            <>
              <>Gas</>{" "}
              <GasFeeValue
                gasUsed={transaction.gas_used}
                gasUnitPrice={transaction.gas_unit_price}
                transactionData={transaction}
                netGasCost
              />
            </>
          ) : null}
        </Box>
      </Stack>
    </GeneralTableCell>
  );
}

// Helper component to display order info in a compact format
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
          sx={{color: aptosColor, fontWeight: 600, fontSize: "14px"}}
        >
          {orderCount}
        </Typography>
      )}
      <Typography component="span" sx={{color: grey[450], fontSize: "14px"}}>
        Orders /
      </Typography>
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
        }}
      >
        {baseToken === "BTC" ? (
          <BTCIcon width={16} height={16} />
        ) : baseToken === "ETH" ? (
          <ETHIcon width={16} height={16} />
        ) : (
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: "#F7931A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
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
        sx={{color: sideInfo.color, fontWeight: 600, fontSize: "14px"}}
      >
        {sideInfo.label}
      </Typography>
      <Typography component="span" sx={{color: "#fff", fontSize: "14px"}}>
        {baseToken}
      </Typography>
      <Typography component="span" sx={{color: "#fff", fontSize: "14px"}}>
        {formatValue(notionalValue)}
      </Typography>
    </Box>
  );
}

function TransactionActionsDetailsCell({transaction}: TransactionCellProps) {
  const {data: perpetuals} = useGetPerpetuals();

  // Block Metadata and Block Epilogue transactions show "--"
  if (
    transaction.type === "block_metadata_transaction" ||
    transaction.type === "block_epilogue_transaction" ||
    transaction.type === "validator_transaction"
  ) {
    return (
      <GeneralTableCell>
        <Typography sx={{color: grey[450]}}>--</Typography>
      </GeneralTableCell>
    );
  }

  // Check if this is a dex_orderless_payload transaction
  const payload =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "payload" in transaction ? (transaction as any).payload : null;
  const isDexOrder =
    payload?.type === "dex_orderless_payload" && payload?.orders?.length > 0;

  if (isDexOrder) {
    const orders = payload.orders as NonNullable<DexPayload["orders"]>;
    const firstOrder = orders[0];

    return (
      <GeneralTableCell>
        <OrderInfoDisplay
          order={firstOrder}
          perpetuals={perpetuals}
          showCount={orders.length > 1}
          orderCount={orders.length}
        />
      </GeneralTableCell>
    );
  }

  // Fallback to default amount/gas display
  return (
    <GeneralTableCell sx={{paddingY: 1}}>
      <Stack sx={{textAlign: "left"}}>
        <TransactionAmount transaction={transaction} />
        <Box sx={{fontSize: 11, color: grey[450]}}>
          {"gas_used" in transaction && "gas_unit_price" in transaction ? (
            <>
              <>Gas</>
              {""}
              <GasFeeValue
                gasUsed={transaction.gas_used}
                gasUnitPrice={transaction.gas_unit_price}
                transactionData={transaction}
                netGasCost
              />
            </>
          ) : null}
        </Box>
      </Stack>
    </GeneralTableCell>
  );
}

const TransactionCells = Object.freeze({
  sequenceNum: SequenceNumberCell,
  versionStatus: TransactionVersionStatusCell,
  version: TransactionVersionCell,
  status: TransactionStatusCell,
  hash: TransactionHashCell,
  type: TransactionTypeCell,
  timestamp: TransactionTimestampCell,
  sender: TransactionSenderCell,
  receiverOrCounterParty: TransactionReceiverOrCounterPartyCell,
  function: TransactionFunctionCell,
  amountGas: TransactionAmountGasCell,
  actionsDetails: TransactionActionsDetailsCell,
});

export type TransactionColumn = keyof typeof TransactionCells;

export const PREVIEW_COLUMNS: TransactionColumn[] = [
  "version",
  "type",
  "status",
  "sender",
  "actionsDetails",
  "timestamp",
];

const DEFAULT_COLUMNS: TransactionColumn[] = [
  "versionStatus",
  "type",
  "timestamp",
  "sender",
  "receiverOrCounterParty",
  "function",
  "amountGas",
];

type TransactionRowProps = {
  transaction: Types.Transaction;
  columns: TransactionColumn[];
};

function TransactionRow({transaction, columns}: TransactionRowProps) {
  return (
    <GeneralTableRow
      to={`/txn/${"version" in transaction && transaction.version}`}
    >
      {columns.map((column) => {
        const Cell = TransactionCells[column];
        return <Cell key={column} transaction={transaction} />;
      })}
    </GeneralTableRow>
  );
}

const TRANSACTION_SKELETON_WIDTHS: Partial<Record<TransactionColumn, number>> =
  {
    version: 120,
    type: 28, // Circle
    status: 80,
    sender: 140, // Reduced from 200 to give space
    timestamp: 140, // Reduced from 200 to give space
    actionsDetails: undefined, // auto
  };

// Skeleton row component that returns a proper TableRow
function TransactionTableSkeletonRow({
  columns,
}: {
  columns: TransactionColumn[];
}) {
  return (
    <TableRow>
      {columns.map((column) => {
        if (column === "type") {
          return (
            <GeneralTableCell
              key={column}
              sx={{width: 100, textAlign: "center"}}
            >
              <Box sx={{display: "flex", justifyContent: "center"}}>
                <SkeletonBlock width={28} height={28} borderRadius={6} />
              </Box>
            </GeneralTableCell>
          );
        }

        if (column === "actionsDetails") {
          return (
            <GeneralTableCell key={column}>
              <SkeletonBlock
                width="40%"
                height={28}
                sx={{maxWidth: 280, minWidth: 150}}
              />
            </GeneralTableCell>
          );
        }

        if (column === "timestamp") {
          return (
            <GeneralTableCell
              key={column}
              sx={{width: 200, textAlign: "right"}}
            >
              <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                <SkeletonBlock width={140} height={28} />
              </Box>
            </GeneralTableCell>
          );
        }

        const width = TRANSACTION_SKELETON_WIDTHS[column];
        return (
          <GeneralTableCell key={column} sx={width ? {width} : undefined}>
            <SkeletonBlock width={width || 100} height={28} />
          </GeneralTableCell>
        );
      })}
    </TableRow>
  );
}

type UserTransactionRowProps = {
  version: number;
  columns: TransactionColumn[];
  address?: string;
};

function UserTransactionRow({
  version,
  columns,
  address,
}: UserTransactionRowProps) {
  const {data: transaction, isError} = useGetTransaction(version.toString());

  if (!transaction || isError) {
    return <TransactionTableSkeletonRow columns={columns} />;
  }

  return (
    <GeneralTableRow to={`/txn/${version}`}>
      {columns.map((column) => {
        const Cell = TransactionCells[column];
        return (
          <Cell key={column} transaction={transaction} address={address} />
        );
      })}
    </GeneralTableRow>
  );
}

type TransactionHeaderCellProps = {
  column: TransactionColumn;
};

function TransactionHeaderCell({column}: TransactionHeaderCellProps) {
  switch (column) {
    case "sequenceNum":
      return <GeneralTableHeaderCell header="#" />;
    case "versionStatus":
      return <GeneralTableHeaderCell header="Version" />;
    case "version":
      return <GeneralTableHeaderCell header="Version" sx={{width: 120}} />;
    case "status":
      return <GeneralTableHeaderCell header="Status" sx={{width: 140}} />;
    case "hash":
      return <GeneralTableHeaderCell header="Hash" />;
    case "type":
      return (
        <GeneralTableHeaderCell
          header="Type"
          tooltip={<TransactionTypeTooltip />}
          sx={{textAlign: "center", width: 100}}
        />
      );
    case "timestamp":
      return (
        <GeneralTableHeaderCell
          header="Timestamp"
          textAlignRight
          sx={{width: 200}}
        />
      );
    case "sender":
      return <GeneralTableHeaderCell header="User" sx={{width: 200}} />;
    case "receiverOrCounterParty":
      return <GeneralTableHeaderCell header="Sent To" />;
    case "function":
      return <GeneralTableHeaderCell header="Function" />;
    case "amountGas":
      return <GeneralTableHeaderCell header="Amount" textAlignRight />;
    case "actionsDetails":
      return <GeneralTableHeaderCell header="Actions / Details" />;
    default:
      return assertNever(column);
  }
}

type TransactionsTableProps = {
  transactions: Types.Transaction[];
  columns?: TransactionColumn[];
  address?: string;
};

export default function TransactionsTable({
  transactions,
  columns = DEFAULT_COLUMNS,
}: TransactionsTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TransactionHeaderCell key={column} column={column} />
          ))}
        </TableRow>
      </TableHead>
      <GeneralTableBody>
        {transactions.map((transaction, i) => {
          return (
            <TransactionRow
              key={`${i}-${transaction.hash}`}
              transaction={transaction}
              columns={columns}
            />
          );
        })}
      </GeneralTableBody>
    </Table>
  );
}

type UserTransactionsTableProps = {
  versions: number[];
  columns?: TransactionColumn[];
  address?: string;
  loading?: boolean;
};

export function UserTransactionsTable({
  versions,
  columns = DEFAULT_COLUMNS,
  address,
  loading = false,
}: UserTransactionsTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TransactionHeaderCell key={column} column={column} />
          ))}
        </TableRow>
      </TableHead>
      <GeneralTableBody>
        {loading && versions.length === 0
          ? Array.from({length: 10}).map((_, i) => (
              <TransactionTableSkeletonRow key={i} columns={columns} />
            ))
          : versions.map((version, i) => {
              return (
                <UserTransactionRow
                  key={`${i}-${version}`}
                  version={version}
                  columns={columns}
                  address={address}
                />
              );
            })}
      </GeneralTableBody>
    </Table>
  );
}
