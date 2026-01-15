import React from "react";
import Box from "@mui/material/Box";
import {useSearchParams} from "react-router-dom";
import {Pagination, Stack} from "@mui/material";
import TransactionsTable, {PREVIEW_COLUMNS} from "./TransactionsTable";
import useGetUserTransactionVersions, {
  useGetUserTransactionsCount,
} from "../../api/hooks/useGetUserTransactionVersions";
import {useGetTransactionsByVersions} from "../../api/hooks/useGetTransactionsByVersions";
import {SkeletonTable} from "../../components/SkeletonBlock";

const LIMIT = 100;

function RenderPagination({
  currentPage,
  numPages,
}: {
  currentPage: number;
  numPages: number;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newPageNum: number,
  ) => {
    searchParams.set("page", newPageNum.toString());
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

export default function UserTransactions() {
  const [searchParams] = useSearchParams();
  const [isHovered, setIsHovered] = React.useState(false);
  const currentPage = parseInt(searchParams.get("page") ?? "1");
  const offset = (currentPage - 1) * LIMIT;

  // Pause polling when hovered
  const pollInterval = isHovered ? 0 : 5000;

  // 1. Get Versions via GraphQL (Polling)
  const {versions: startVersionArray, loading: loadingStart} =
    useGetUserTransactionVersions(1, undefined, undefined, pollInterval);
  const startVersion = startVersionArray[0];
  const {versions, loading: loadingVersions} = useGetUserTransactionVersions(
    LIMIT,
    startVersion,
    offset,
    pollInterval,
  );

  // 2. Get Transaction Details via REST (Batched, Seamless)
  const {data: transactions, isLoading: isLoadingDetails} =
    useGetTransactionsByVersions(versions);

  const totalCount = useGetUserTransactionsCount();

  // Show skeleton only on initial load or if we have no versions yet/loading versions
  // Once we have versions, we might be fetching details, but keepPreviousData handles the seam.
  // We should show skeleton if we are loading versions (initial) OR if we have versions but no transaction data yet (and not just refreshing).
  const hasVersions = versions.length > 0;
  const isInitialLoad = (loadingStart || loadingVersions) && !hasVersions;
  const isWaitingForDetails = hasVersions && isLoadingDetails && !transactions;

  const showSkeleton = isInitialLoad || isWaitingForDetails;

  // Calculate total pages based on actual data count
  const numPages = totalCount ? Math.ceil(totalCount / LIMIT) : 1;

  return (
    <>
      <Stack spacing={2}>
        <Box
          sx={{width: "auto", overflowX: "auto"}}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {showSkeleton ? (
            // Re-use TransactionsTable but pass empty to show skeletons if it supports it,
            // OR manually render skeleton rows.
            // TransactionsTable doesn't have a 'loading' prop natively exposed like UserTransactionsTable did,
            // but we can pass null/undefined or use a wrapper.
            // Actually UserTransactionsTable had the skeleton logic.
            // Let's use the SkeletonTable component from TransactionsPreview as a reference or use TransactionsTable if we add loading prop.
            // For now, let's look at how TransactionsPreview does it: <SkeletonTable rowCount={10} />
            // We can import SkeletonTable from components.
            <SkeletonTable rowCount={10} />
          ) : (
            <TransactionsTable
              transactions={transactions || []}
              columns={PREVIEW_COLUMNS}
            />
          )}
        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
          <RenderPagination currentPage={currentPage} numPages={numPages} />
        </Box>
      </Stack>
    </>
  );
}
