import React from "react";
import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import {Types} from "aptos";
import {getLedgerInfo, getTransactions} from "../../api";
import {useGlobalState} from "../../global-config/GlobalConfig";
import Box from "@mui/material/Box";
import {useSearchParams} from "react-router-dom";
import {Pagination, Stack, Typography, InputBase} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TransactionsTable, {PREVIEW_COLUMNS} from "./TransactionsTable";

const LIMIT = 20;

function maxStart(maxVersion: number, limit: number) {
  return 1 + maxVersion - limit;
}

function RenderPagination({
  start,
  limit,
  maxVersion,
}: {
  start: number;
  limit: number;
  maxVersion: number;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const numPages = Math.ceil(maxVersion / limit);
  const progress = 1 - (start + limit - 1) / maxVersion;
  const currentPage = 1 + Math.floor(progress * numPages);

  const handleChange = (
    _event: React.ChangeEvent<unknown>,
    newPageNum: number,
  ) => {
    const delta = (currentPage - newPageNum) * limit;
    const newStart = Math.max(
      0,
      Math.min(maxStart(maxVersion, limit), start + delta),
    );

    searchParams.set("start", newStart.toString());
    setSearchParams(searchParams);
  };

  return (
    <Pagination
      sx={{mt: 3}}
      count={numPages}
      variant="outlined"
      showFirstButton
      showLastButton
      page={currentPage}
      siblingCount={4}
      boundaryCount={0}
      shape="rounded"
      onChange={handleChange}
    />
  );
}

function TransactionContent({data}: UseQueryResult<Array<Types.Transaction>>) {
  if (!data) {
    // TODO: error handling!
    return null;
  }

  return <TransactionsTable transactions={data} columns={PREVIEW_COLUMNS} />;
}

function TransactionsPageInner({data}: UseQueryResult<Types.IndexResponse>) {
  const maxVersion = parseInt(data?.ledger_version ?? "");
  const limit = LIMIT;
  const [state] = useGlobalState();
  const [searchParams] = useSearchParams();

  let start = maxStart(maxVersion, limit);
  const startParam = searchParams.get("start");
  if (startParam !== null) {
    start = parseInt(startParam);
  }

  const result = useQuery({
    queryKey: ["transactions", {start, limit}, state.network_value],
    queryFn: () => getTransactions({start, limit}, state.aptos_client),
    placeholderData: keepPreviousData,
  });

  return (
    <>
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
            All Transactions
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
              outline: "none",
              "&:focus-within": {
                outline: "none",
                border: "1px solid rgba(255, 255, 255, 0.16)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiInputBase-root": {
                border: "none",
              },
            }}
          >
            <SearchIcon
              sx={{color: "rgba(255, 255, 255, 0.4)", fontSize: 20}}
            />
            <InputBase
              placeholder="Search Explorer"
              sx={{
                color: "#fff",
                width: "100%",
                fontSize: "14px",
                fontFamily: '"SF Pro", sans-serif',
                lineHeight: "18px",
                border: "none",
                outline: "none",
                "& fieldset": {
                  border: "none",
                },
                "& input::placeholder": {
                  color: "rgba(255, 255, 255, 0.4)",
                  opacity: 1,
                },
                "& input:focus": {
                  outline: "none",
                },
              }}
            />
          </Box>
        </Stack>

        <Box sx={{width: "auto", overflowX: "auto"}}>
          <TransactionContent {...result} />
        </Box>

        <Box sx={{display: "flex", justifyContent: "center"}}>
          <RenderPagination
            {...{
              start,
              limit,
              maxVersion,
            }}
          />
        </Box>
      </Box>
    </>
  );
}

export default function AllTransactions() {
  const [state] = useGlobalState();

  const result = useQuery({
    queryKey: ["ledgerInfo", state.network_value],
    queryFn: () => getLedgerInfo(state.aptos_client),
    refetchInterval: 10000,
  });

  return <TransactionsPageInner {...result} />;
}
