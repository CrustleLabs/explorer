import React from "react";
import Box from "@mui/material/Box";
import {useSearchParams} from "react-router-dom";
import {Pagination, Stack} from "@mui/material";
import {UserTransactionsTable} from "./TransactionsTable";
import useGetUserTransactionVersions, {
  useGetUserTransactionsCount,
} from "../../api/hooks/useGetUserTransactionVersions";

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
  const currentPage = parseInt(searchParams.get("page") ?? "1");
  const offset = (currentPage - 1) * LIMIT;

  const startVersion = useGetUserTransactionVersions(1)[0];
  const versions = useGetUserTransactionVersions(LIMIT, startVersion, offset);
  const totalCount = useGetUserTransactionsCount();

  // Calculate total pages based on actual data count
  // Default to 1 page if count is not yet loaded
  const numPages = totalCount ? Math.ceil(totalCount / LIMIT) : 1;

  return (
    <>
      <Stack spacing={2}>
        <Box sx={{width: "auto", overflowX: "auto"}}>
          <UserTransactionsTable versions={versions} />
        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
          <RenderPagination currentPage={currentPage} numPages={numPages} />
        </Box>
      </Stack>
    </>
  );
}
