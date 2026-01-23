import React from "react";
import {Types} from "aptos";
import UnifiedPageHeader from "../../components/UnifiedPageHeader";

type TransactionTitleProps = {
  transaction?: Types.Transaction;
};

export default function TransactionTitle({transaction}: TransactionTitleProps) {
  let metaTitle = "Transaction Details";
  if (transaction) {
    metaTitle = `Transaction ${transaction.hash}`;
    if ("version" in transaction) {
      metaTitle = ` Transaction ${transaction.version} (${transaction.hash})`;
    }
  }

  return (
    <UnifiedPageHeader title="Transactions Details" metaTitle={metaTitle} />
  );
}
