import {gql} from "@apollo/client";
import {useQuery as useGraphqlQuery} from "@apollo/client/react";

// Query to get aggregated PnL from dex_trades
const GET_REALIZED_PNL = gql`
  query GetRealizedPnL($address: String!) {
    dex_trades_aggregate(where: {address: {_eq: $address}}) {
      aggregate {
        sum {
          pnl
        }
      }
    }
  }
`;

export function useGetRealizedPnl(address: string | undefined) {
  const {data, loading, error} = useGraphqlQuery<{
    dex_trades_aggregate: {
      aggregate: {
        sum: {
          pnl: number;
        };
      };
    };
  }>(GET_REALIZED_PNL, {
    variables: {address},
    skip: !address,
  });

  const realizedPnl = data?.dex_trades_aggregate?.aggregate?.sum?.pnl || 0;

  return {
    realizedPnl,
    loading,
    error,
  };
}
