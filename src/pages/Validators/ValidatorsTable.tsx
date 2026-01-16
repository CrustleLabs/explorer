import React, {useState} from "react";
import {
  Box,
  Stack,
  Table,
  TableHead,
  TableRow,
  Typography,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GeneralTableRow from "../../components/Table/GeneralTableRow";
import GeneralTableHeaderCell from "../../components/Table/GeneralTableHeaderCell";
import {assertNever} from "../../utils";
import HashButton, {HashType} from "../../components/HashButton";
import GeneralTableBody from "../../components/Table/GeneralTableBody";
import GeneralTableCell from "../../components/Table/GeneralTableCell";
import RewardsPerformanceTooltip from "./Components/RewardsPerformanceTooltip";
import LastEpochPerformanceTooltip from "./Components/LastEpochPerformanceTooltip";
import {
  ValidatorData,
  useGetValidators,
} from "../../api/hooks/useGetValidators";
import {getFormattedBalanceStr} from "../../components/IndividualPageContent/ContentValue/CurrencyValue";

function getSortedValidators(
  validators: ValidatorData[],
  column: Column,
  direction: "desc" | "asc",
  filterZeroVotingPower = true,
) {
  const validatorsCopy: ValidatorData[] = JSON.parse(
    JSON.stringify(validators),
  );
  let filteredValidators = validatorsCopy;
  if (filterZeroVotingPower) {
    filteredValidators = validatorsCopy.filter((validator) => {
      return Number(validator.voting_power) !== 0;
    });
  }
  const orderedValidators = getValidatorsOrderedBy(filteredValidators, column);

  return direction === "desc" ? orderedValidators : orderedValidators.reverse();
}

function getValidatorsOrderedBy(
  validatorsCopy: ValidatorData[],
  column: Column,
) {
  switch (column) {
    case "votingPower":
      return validatorsCopy.sort(
        (validator1, validator2) =>
          parseInt(validator2.voting_power) - parseInt(validator1.voting_power),
      );
    case "rewardsPerf":
      return validatorsCopy.sort(
        (validator1, validator2) =>
          (validator2.rewards_growth ?? 0) - (validator1.rewards_growth ?? 0),
      );
    case "lastEpochPerf":
      return validatorsCopy.sort(
        (validator1, validator2) =>
          parseInt(validator2.last_epoch_performance ?? "") -
          parseInt(validator1.last_epoch_performance ?? ""),
      );
    case "location":
      return validatorsCopy.sort((validator1, validator2) =>
        (validator1.location_stats?.city ?? "zz").localeCompare(
          validator2.location_stats?.city ?? "zz",
        ),
      );
    default:
      return validatorsCopy;
  }
}

type SortableHeaderCellProps = {
  header: string;
  column: Column;
  direction?: "desc" | "asc";
  setDirection?: (dir: "desc" | "asc") => void;
  setSortColumn: (col: Column) => void;
  tooltip?: React.ReactNode;
  isTableTooltip?: boolean;
};

function SortableHeaderCell({
  header,
  column,
  direction,
  setDirection,
  setSortColumn,
  tooltip,
  isTableTooltip,
}: SortableHeaderCellProps) {
  return (
    <GeneralTableHeaderCell
      header={header}
      textAlignRight
      sortable
      direction={direction}
      selectAndSetDirection={(dir) => {
        setSortColumn(column);
        if (setDirection) {
          setDirection(dir);
        }
      }}
      tooltip={tooltip}
      isTableTooltip={isTableTooltip}
    />
  );
}

type ValidatorHeaderCellProps = {
  column: Column;
  direction?: "desc" | "asc";
  setDirection?: (dir: "desc" | "asc") => void;
  setSortColumn: (col: Column) => void;
};

function ValidatorHeaderCell({
  column,
  direction,
  setDirection,
  setSortColumn,
}: ValidatorHeaderCellProps) {
  switch (column) {
    case "addr":
      return <GeneralTableHeaderCell header="Staking Pool Address" />;
    case "operatorAddr":
      return <GeneralTableHeaderCell header="Operator Address" />;
    case "votingPower":
      return (
        <SortableHeaderCell
          header="Voting Power"
          column={column}
          direction={direction}
          setDirection={setDirection}
          setSortColumn={setSortColumn}
        />
      );
    case "rewardsPerf":
      return (
        <SortableHeaderCell
          header="Rewards Perf"
          column={column}
          direction={direction}
          setDirection={setDirection}
          setSortColumn={setSortColumn}
          tooltip={<RewardsPerformanceTooltip />}
        />
      );
    case "lastEpochPerf":
      return (
        <SortableHeaderCell
          header="Last Epoch Perf"
          column={column}
          direction={direction}
          setDirection={setDirection}
          setSortColumn={setSortColumn}
          tooltip={<LastEpochPerformanceTooltip />}
        />
      );
    case "location":
      return (
        <SortableHeaderCell
          header="Location"
          column={column}
          direction={direction}
          setDirection={setDirection}
          setSortColumn={setSortColumn}
        />
      );
    default:
      return assertNever(column);
  }
}

type ValidatorCellProps = {
  validator: ValidatorData;
};

export function ValidatorAddrCell({validator}: ValidatorCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "left"}}>
      <HashButton hash={validator.owner_address} type={HashType.ACCOUNT} />
    </GeneralTableCell>
  );
}

export function OperatorAddrCell({validator}: ValidatorCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "left"}}>
      <HashButton
        hash={validator.operator_address}
        type={HashType.ACCOUNT}
        isValidator
      />
    </GeneralTableCell>
  );
}

function VotingPowerCell({validator}: ValidatorCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "right"}}>
      {getFormattedBalanceStr(validator.voting_power.toString(), undefined, 0)}
    </GeneralTableCell>
  );
}

export function RewardsPerformanceCell({validator}: ValidatorCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "left", paddingRight: 5}}>
      {validator.rewards_growth === undefined ? null : (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          justifyContent="flex-end"
        >
          <Box>{`${validator.rewards_growth.toFixed(2)} %`}</Box>
        </Stack>
      )}
    </GeneralTableCell>
  );
}

function LastEpochPerformanceCell({validator}: ValidatorCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "right", paddingRight: 5}}>
      {validator.last_epoch_performance}
    </GeneralTableCell>
  );
}

function LocationCell({validator}: ValidatorCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "right"}}>
      {validator.location_stats?.city && validator.location_stats?.country
        ? `${validator.location_stats?.city}, ${validator.location_stats?.country}`
        : "-"}
    </GeneralTableCell>
  );
}

const ValidatorCells = Object.freeze({
  addr: ValidatorAddrCell,
  operatorAddr: OperatorAddrCell,
  votingPower: VotingPowerCell,
  rewardsPerf: RewardsPerformanceCell,
  lastEpochPerf: LastEpochPerformanceCell,
  location: LocationCell,
});

type Column = keyof typeof ValidatorCells;

const DEFAULT_COLUMNS: Column[] = [
  "addr",
  "operatorAddr",
  "votingPower",
  "rewardsPerf",
  "lastEpochPerf",
  "location",
];

type ValidatorRowProps = {
  validator: ValidatorData;
  columns: Column[];
};

function ValidatorRow({validator, columns}: ValidatorRowProps) {
  return (
    <GeneralTableRow>
      {columns.map((column) => {
        const Cell = ValidatorCells[column];
        return <Cell key={column} validator={validator} />;
      })}
    </GeneralTableRow>
  );
}

export function ValidatorsTable() {
  const {validators} = useGetValidators();
  const [searchQuery, setSearchQuery] = useState("");

  const [sortColumn, setSortColumn] = useState<Column>("votingPower");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  // Filter validators based on search query
  const filteredValidatorsRaw = React.useMemo(() => {
    if (!searchQuery) return validators;
    const lowerQuery = searchQuery.toLowerCase();
    return validators.filter((v) => {
      return (
        v.owner_address.toLowerCase().includes(lowerQuery) ||
        (v.operator_address &&
          v.operator_address.toLowerCase().includes(lowerQuery)) ||
        (v.location_stats?.city &&
          v.location_stats.city.toLowerCase().includes(lowerQuery)) ||
        (v.location_stats?.country &&
          v.location_stats.country.toLowerCase().includes(lowerQuery))
      );
    });
  }, [validators, searchQuery]);

  const sortedValidators = getSortedValidators(
    filteredValidatorsRaw,
    sortColumn,
    sortDirection,
  );

  const columns = DEFAULT_COLUMNS;

  return (
    <Box
      sx={{
        backgroundColor: "#16141A",
        border: "0.5px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "24px",
        p: "20px",
        mt: 4,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={700} color="#fff">
          Validators
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            borderRadius: "100px",
            padding: "12px 16px",
            width: "350px",
            height: "48px",
          }}
        >
          <SearchIcon sx={{color: "rgba(255, 255, 255, 0.4)", fontSize: 20}} />
          <InputBase
            placeholder="Search Explorer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: "#fff",
              width: "100%",
              fontSize: "14px",
              fontFamily: '"SF Pro", sans-serif',
              "& input::placeholder": {
                color: "rgba(255, 255, 255, 0.4)",
                opacity: 1,
              },
            }}
          />
        </Box>
      </Stack>

      <Table>
        <TableHead>
          <TableRow sx={{verticalAlign: "bottom"}}>
            {columns.map((column) => (
              <ValidatorHeaderCell
                key={column}
                column={column}
                direction={sortColumn === column ? sortDirection : undefined}
                setDirection={setSortDirection}
                setSortColumn={setSortColumn}
              />
            ))}
          </TableRow>
        </TableHead>
        <GeneralTableBody>
          {sortedValidators.map((validator: ValidatorData, i: number) => {
            return (
              <ValidatorRow key={i} validator={validator} columns={columns} />
            );
          })}
          {sortedValidators.length === 0 && (
            <TableRow>
              <GeneralTableCell
                colSpan={columns.length}
                sx={{textAlign: "center", py: 4}}
              >
                <Typography color="text.secondary">
                  No validators found
                </Typography>
              </GeneralTableCell>
            </TableRow>
          )}
        </GeneralTableBody>
      </Table>
    </Box>
  );
}
