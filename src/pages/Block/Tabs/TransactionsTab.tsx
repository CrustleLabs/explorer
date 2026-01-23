import React, {useState} from "react";
import {Box} from "@mui/material";
import TransactionsTable from "../../Transactions/TransactionsTable";
import EmptyTabContent from "../../../components/IndividualPageContent/EmptyTabContent";
import {Block} from "@aptos-labs/ts-sdk";
import {Types} from "aptos";
import BlockPagination from "../Components/BlockPagination";

type TransactionsTabProps = {
  data: Block;
};

export default function TransactionsTab({data}: TransactionsTabProps) {
  const transactions = (data.transactions ?? []) as Types.Transaction[];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  if (transactions.length === 0) {
    return <EmptyTabContent />;
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box>
      <TransactionsTable transactions={paginatedTransactions} />
      <BlockPagination
        count={transactions.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
}
