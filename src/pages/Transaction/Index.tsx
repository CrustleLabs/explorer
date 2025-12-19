import {Stack, Grid, Alert} from "@mui/material";
import {Types} from "aptos";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {ResponseError} from "../../api/client";
import {getTransaction} from "../../api";
import Error from "./Error";
import TransactionTitle from "./Title";
import TransactionTabs from "./Tabs";
import {useGetBlockByVersion} from "../../api/hooks/useGetBlock";

export default function TransactionPage() {
  const [state] = useGlobalState();
  const {txnHashOrVersion: txnParam} = useParams();
  const txnHashOrVersion = txnParam ?? "";

  const {isLoading, data, error} = useQuery<Types.Transaction, ResponseError>({
    queryKey: ["transaction", {txnHashOrVersion}, state.network_value],
    queryFn: () => getTransaction({txnHashOrVersion}, state.aptos_client),
  });

  const version = data && "version" in data ? Number(data.version) : 0;
  const {data: blockData} = useGetBlockByVersion({
    version,
    withTransactions: false,
    options: {enabled: !!data && "version" in data},
  });

  if (isLoading) {
    return null;
  }

  if (error) {
    return <Error error={error} txnHashOrVersion={txnHashOrVersion} />;
  }

  if (!data) {
    return (
      <Alert severity="error">
        Got an empty response fetching transaction with version or hash{" "}
        {txnHashOrVersion}
        <br />
        Try again later
      </Alert>
    );
  }

  const transactionWithBlock: Types.Transaction & {
    block_height?: string | number;
  } = {
    ...data,
    block_height:
      "block_height" in data &&
      (typeof data.block_height === "string" ||
        typeof data.block_height === "number")
        ? data.block_height
        : (blockData?.block_height ?? undefined),
  };

  return (
    <Grid container>
      <Grid size={{xs: 12}}>
        <Stack direction="column" spacing={4} marginTop={2}>
          <TransactionTitle transaction={transactionWithBlock} />
          <TransactionTabs transaction={transactionWithBlock} />
        </Stack>
      </Grid>
    </Grid>
  );
}
