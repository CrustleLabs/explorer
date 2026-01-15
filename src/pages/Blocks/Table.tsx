import * as React from "react";
import {
  Table,
  TableHead,
  TableRow,
  Box,
  Stack,
  Typography,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GeneralTableRow from "../../components/Table/GeneralTableRow";
import GeneralTableHeaderCell from "../../components/Table/GeneralTableHeaderCell";
import {assertNever} from "../../utils";
import HashButton, {HashType} from "../../components/HashButton";
import {Types} from "aptos";
import {parseTimestamp} from "../utils";
import moment from "moment";
import GeneralTableBody from "../../components/Table/GeneralTableBody";
import GeneralTableCell from "../../components/Table/GeneralTableCell";
import {Link, useAugmentToWithGlobalSearchParams} from "../../routing";
import SkeletonBlock from "../../components/SkeletonBlock";

function getAgeInSeconds(block: Types.Block): string {
  const blockTimestamp = parseTimestamp(block.block_timestamp);
  const nowTimestamp = parseTimestamp(moment.now().toString());
  const duration = moment.duration(nowTimestamp.diff(blockTimestamp));
  return duration.asSeconds().toFixed(0);
}

type BlockCellProps = {
  block: Types.Block;
};

function BlockHeightCell({block}: BlockCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "left"}}>
      <Link to={`/block/${block.block_height}`} underline="none">
        {block.block_height}
      </Link>
    </GeneralTableCell>
  );
}

function BlockAgeCell({block}: BlockCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "left"}}>
      {`${getAgeInSeconds(block)}s ago`}
    </GeneralTableCell>
  );
}

function BlockHashCell({block}: BlockCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "left"}}>
      <HashButton hash={block.block_hash} type={HashType.OTHERS} />
    </GeneralTableCell>
  );
}

function CountVersionCell({block}: BlockCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "right"}}>
      {(
        BigInt(block.last_version) -
        BigInt(block.first_version) +
        BigInt(1)
      ).toString()}
    </GeneralTableCell>
  );
}

function FirstVersionCell({block}: BlockCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "right"}}>
      <Link to={`/txn/${block.first_version}`} underline="none">
        {block.first_version}
      </Link>
    </GeneralTableCell>
  );
}

function LastVersionCell({block}: BlockCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "right"}}>
      <Link to={`/txn/${block.last_version}`} underline="none">
        {block.last_version}
      </Link>
    </GeneralTableCell>
  );
}

const BlockCells = Object.freeze({
  height: BlockHeightCell,
  age: BlockAgeCell,
  hash: BlockHashCell,
  numVersions: CountVersionCell,
  firstVersion: FirstVersionCell,
  lastVersion: LastVersionCell,
});

type Column = keyof typeof BlockCells;

const DEFAULT_COLUMNS: Column[] = [
  "height",
  "age",
  "hash",
  "numVersions",
  "firstVersion",
  "lastVersion",
];

type BlockRowProps = {
  block: Types.Block;
  columns: Column[];
};

function BlockRow({block, columns}: BlockRowProps) {
  const augmentTo = useAugmentToWithGlobalSearchParams();

  return (
    <GeneralTableRow to={augmentTo(`/block/${block.block_height}`)}>
      {columns.map((column) => {
        const Cell = BlockCells[column];
        return <Cell key={column} block={block} />;
      })}
    </GeneralTableRow>
  );
}

type BlockHeaderCellProps = {
  column: Column;
};

function BlockHeaderCell({column}: BlockHeaderCellProps) {
  switch (column) {
    case "height":
      return <GeneralTableHeaderCell header="Block" />;
    case "age":
      return <GeneralTableHeaderCell header="Age" />;
    case "hash":
      return <GeneralTableHeaderCell header="Hash" />;
    case "numVersions":
      return (
        <GeneralTableHeaderCell header="Num Transactions" textAlignRight />
      );
    case "firstVersion":
      return <GeneralTableHeaderCell header="First Version" textAlignRight />;
    case "lastVersion":
      return <GeneralTableHeaderCell header="Last Version" textAlignRight />;
    default:
      return assertNever(column);
  }
}

type BlocksTableProps = {
  blocks: Types.Block[];
  columns?: Column[];
  isLoading?: boolean;
};

function BlocksSkeletonRow() {
  return (
    <GeneralTableRow>
      <GeneralTableCell>
        <SkeletonBlock width={100} height={24} />
      </GeneralTableCell>
      <GeneralTableCell>
        <SkeletonBlock width={80} height={24} />
      </GeneralTableCell>
      <GeneralTableCell>
        <SkeletonBlock width={140} height={24} />
      </GeneralTableCell>
      <GeneralTableCell sx={{textAlign: "right"}}>
        <Box sx={{display: "flex", justifyContent: "flex-end"}}>
          <SkeletonBlock width={60} height={24} />
        </Box>
      </GeneralTableCell>
      <GeneralTableCell sx={{textAlign: "right"}}>
        <Box sx={{display: "flex", justifyContent: "flex-end"}}>
          <SkeletonBlock width={120} height={24} />
        </Box>
      </GeneralTableCell>
      <GeneralTableCell sx={{textAlign: "right"}}>
        <Box sx={{display: "flex", justifyContent: "flex-end"}}>
          <SkeletonBlock width={120} height={24} />
        </Box>
      </GeneralTableCell>
    </GeneralTableRow>
  );
}

export default function BlocksTable({
  blocks,
  columns = DEFAULT_COLUMNS,
  isLoading = false,
}: BlocksTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  // TODO: Fix this better than this change here, this seems to be a bug elsewhere that I'm trying to fix on first load of page
  if (blocks == null) {
    blocks = [];
  } else if (!Array.isArray(blocks)) {
    blocks = [blocks];
  }

  // Filter blocks based on search query (by height or hash)
  const filteredBlocks = React.useMemo(() => {
    if (!searchQuery) return blocks;
    const lowerQuery = searchQuery.toLowerCase();
    return blocks.filter((block) => {
      return (
        block.block_height.toString().includes(lowerQuery) ||
        block.block_hash.toLowerCase().includes(lowerQuery)
      );
    });
  }, [blocks, searchQuery]);

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
          Latest Blocks
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "100px",
            padding: "8px 16px",
            width: "300px",
          }}
        >
          <SearchIcon sx={{color: "#888", mr: 1}} />
          <InputBase
            placeholder="Search Explorer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{color: "#fff", width: "100%", fontSize: "14px"}}
          />
        </Box>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <BlockHeaderCell key={column} column={column} />
            ))}
          </TableRow>
        </TableHead>
        <GeneralTableBody>
          {isLoading
            ? Array.from({length: 10}).map((_, i) => (
                <BlocksSkeletonRow key={i} />
              ))
            : filteredBlocks &&
              filteredBlocks.map((block: Types.Block, i: number) => {
                return <BlockRow key={i} block={block} columns={columns} />;
              })}
          {!isLoading && filteredBlocks && filteredBlocks.length === 0 && (
            <TableRow>
              <GeneralTableCell
                colSpan={columns.length}
                sx={{textAlign: "center", py: 4}}
              >
                <Typography color="text.secondary">No blocks found</Typography>
              </GeneralTableCell>
            </TableRow>
          )}
        </GeneralTableBody>
      </Table>
    </Box>
  );
}
