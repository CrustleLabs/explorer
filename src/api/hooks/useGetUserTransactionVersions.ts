import {gql} from "@apollo/client";
import {useQuery as useGraphqlQuery} from "@apollo/client/react";

const USER_TRANSACTIONS_QUERY = gql`
  query UserTransactions($limit: Int, $start_version: bigint, $offset: Int) {
    user_transactions(
      limit: $limit
      order_by: {version: desc}
      where: {version: {_lte: $start_version}}
      offset: $offset
    ) {
      version
    }
  }
`;

const TOP_USER_TRANSACTIONS_QUERY = gql`
  query UserTransactions($limit: Int) {
    user_transactions(limit: $limit, order_by: {version: desc}) {
      version
    }
  }
`;

const USER_TRANSACTIONS_COUNT_QUERY = gql`
  query UserTransactionsCount {
    user_transactions_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export default function useGetUserTransactionVersions(
  limit: number,
  startVersion?: number,
  offset?: number,
  pollInterval: number = 5000,
): {versions: number[]; loading: boolean} {
  const topTxnsOnly = startVersion === undefined || offset === undefined;
  const {loading, error, data} = useGraphqlQuery<{
    user_transactions: {version: number}[];
  }>(topTxnsOnly ? TOP_USER_TRANSACTIONS_QUERY : USER_TRANSACTIONS_QUERY, {
    variables: {limit: limit, start_version: startVersion, offset: offset},
    pollInterval: pollInterval,
  });

  if ((loading && !data) || error) {
    return {versions: [], loading: loading};
  }

  if (!data) {
    return {versions: [], loading: false};
  }

  return {
    versions: data.user_transactions.map((txn: {version: number}) => {
      return txn.version;
    }),
    loading: loading,
  };
}

export function useGetUserTransactionsCount(): number | undefined {
  const {loading, error, data} = useGraphqlQuery<{
    user_transactions_aggregate: {
      aggregate: {
        count: number;
      };
    };
  }>(USER_TRANSACTIONS_COUNT_QUERY);

  if (loading || error || !data) {
    return undefined;
  }

  return data.user_transactions_aggregate.aggregate.count;
}
