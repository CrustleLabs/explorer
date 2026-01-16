import {Box, Grid} from "@mui/material";
import {Types} from "aptos";
import {assertNever} from "../../utils";
import StyledTabs from "../../components/StyledTabs";
import StyledTab from "../../components/StyledTab";
import TransactionSidebar from "./Sidebar";
import UserTransactionOverviewTab from "./Tabs/UserTransactionOverviewTab";
import BlockMetadataOverviewTab from "./Tabs/BlockMetadataOverviewTab";
import StateCheckpointOverviewTab from "./Tabs/StateCheckpointOverviewTab";
import PendingTransactionOverviewTab from "./Tabs/PendingTransactionOverviewTab";
import GenesisTransactionOverviewTab from "./Tabs/GenesisTransactionOverviewTab";
import EventsTab from "./Tabs/EventsTab";
import PayloadTab from "./Tabs/PayloadTab";
import ChangesTab from "./Tabs/ChangesTab";
import UnknownTab from "./Tabs/UnknownTab";
import BalanceChangeTab from "./Tabs/BalanceChangeTab";
import {useParams} from "react-router-dom";
import {useNavigate} from "../../routing";
import ValidatorTransactionTab from "./Tabs/ValidatorTransactionTab";
import {TransactionTypeName} from "../../components/TransactionType";
import BlockEpilogueOverviewTab from "./Tabs/BlockEpilogueOverviewTab";
import AllTransactionsSection from "./Tabs/Components/AllTransactionsSection";

function getTabValues(transaction: Types.Transaction): TabValue[] {
  // For DEX/Order transactions, exclude "changes" tab
  if (
    transaction.type === TransactionTypeName.User &&
    (transaction as Types.UserTransaction).payload?.type ===
      "dex_orderless_payload"
  ) {
    return ["userTxnOverview", "events", "payload"];
  }

  switch (transaction.type) {
    case TransactionTypeName.User:
      return ["userTxnOverview", "events", "payload", "changes"];
    case TransactionTypeName.BlockMetadata:
      return ["blockMetadataOverview", "events", "changes"];
    case TransactionTypeName.StateCheckpoint:
      return ["stateCheckpointOverview"];
    case TransactionTypeName.Pending:
      return ["pendingTxnOverview", "payload"];
    case TransactionTypeName.Genesis:
      return ["genesisTxnOverview", "events", "payload", "changes"];
    case TransactionTypeName.Validator:
      return ["validatorTxnOverview", "events", "changes"];
    case TransactionTypeName.BlockEpilogue:
      return ["blockEpilogueOverview", "events", "changes"];
    default:
      return ["unknown", "events", "changes"];
  }
}

const TabComponents = Object.freeze({
  userTxnOverview: UserTransactionOverviewTab,
  blockMetadataOverview: BlockMetadataOverviewTab,
  blockEpilogueOverview: BlockEpilogueOverviewTab,
  stateCheckpointOverview: StateCheckpointOverviewTab,
  pendingTxnOverview: PendingTransactionOverviewTab,
  genesisTxnOverview: GenesisTransactionOverviewTab,
  validatorTxnOverview: ValidatorTransactionTab,
  balanceChange: BalanceChangeTab,
  events: EventsTab,
  payload: PayloadTab,
  changes: ChangesTab,
  unknown: UnknownTab,
});

type TabValue = keyof typeof TabComponents;

function getTabLabel(value: TabValue): string {
  switch (value) {
    case "userTxnOverview":
    case "blockMetadataOverview":
    case "blockEpilogueOverview":
    case "stateCheckpointOverview":
    case "pendingTxnOverview":
    case "genesisTxnOverview":
    case "validatorTxnOverview":
    case "unknown":
      return "Overview";
    case "balanceChange":
      return "Balance Change";
    case "events":
      return "Events";
    case "payload":
      return "Payload";
    case "changes":
      return "Changes";
    default:
      return assertNever(value);
  }
}

type TabPanelProps = {
  value: TabValue;
  transaction: Types.Transaction;
};

function TabPanel({value, transaction}: TabPanelProps): React.JSX.Element {
  const TabComponent = TabComponents[value];
  return <TabComponent transaction={transaction} />;
}

type TransactionTabsProps = {
  transaction: Types.Transaction;
  tabValues?: TabValue[];
};

export default function TransactionTabs({
  transaction,
  tabValues = getTabValues(transaction),
}: TransactionTabsProps): React.JSX.Element {
  const {tab, txnHashOrVersion} = useParams();
  const navigate = useNavigate();
  const value =
    tab === undefined ? getTabValues(transaction)[0] : (tab as TabValue);

  const handleChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    navigate(`/txn/${txnHashOrVersion}/${newValue}`, {replace: true});
  };

  return (
    <Box sx={{width: "100%"}}>
      <Box>
        <StyledTabs value={value} onChange={handleChange}>
          {tabValues.map((value, i) => (
            <StyledTab
              key={i}
              value={value}
              label={getTabLabel(value)}
              isFirst={i === 0}
              isLast={i === tabValues.length - 1}
            />
          ))}
        </StyledTabs>
      </Box>
      <Grid container spacing={3} marginTop={2}>
        {/* Only show Sidebar and 2-column layout if it is a Dex transaction */}
        {transaction.type === "user_transaction" &&
        ((transaction as Types.UserTransaction).payload?.type ===
          "dex_orderless_payload" ||
          ((transaction as Types.UserTransaction).payload?.type ===
            "entry_function_payload" &&
            ((
              (transaction as Types.UserTransaction)
                .payload as Types.TransactionPayload_EntryFunctionPayload
            ).function?.endsWith("::aptos_coin::mint") ||
              (
                (transaction as Types.UserTransaction)
                  .payload as Types.TransactionPayload_EntryFunctionPayload
              ).function?.endsWith("::usdc::mint")))) ? (
          <>
            <Grid size={{xs: 12, md: 8}}>
              <TabPanel value={value} transaction={transaction} />
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <TransactionSidebar transaction={transaction} />
            </Grid>
            {/* All Transactions Section - Full Width Below */}
            <Grid size={{xs: 12}}>
              <AllTransactionsSection transaction={transaction} />
            </Grid>
          </>
        ) : (
          <Grid size={{xs: 12}}>
            <TabPanel value={value} transaction={transaction} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
