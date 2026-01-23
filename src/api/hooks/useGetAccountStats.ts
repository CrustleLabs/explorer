import {gql} from "@apollo/client";
import {useQuery as useGraphqlQuery} from "@apollo/client/react";
import {tryStandardizeAddress} from "../../utils";

const GET_ACCOUNT_STATS = gql`
  query GetAccountStats($address: String!) {
    user_transactions_aggregate(where: {sender: {_eq: $address}}) {
      aggregate {
        count
        min {
          timestamp
        }
      }
    }
  }
`;

export function useGetAccountStats(address: string) {
  // Convert to 66-char address for user_transactions (standard on Aptos Indexer)
  const standardizedAddress = tryStandardizeAddress(address);

  const {data, loading, error} = useGraphqlQuery<{
    user_transactions_aggregate: {
      aggregate: {
        count: number;
        min: {
          timestamp: string; // Timestamp usually returned as string (microseconds)
        };
      };
    };
  }>(GET_ACCOUNT_STATS, {
    variables: {address: standardizedAddress},
    skip: !standardizedAddress,
  });

  const aggregate = data?.user_transactions_aggregate?.aggregate;
  const totalTransactions = aggregate?.count || 0;
  // Convert timestamp (microseconds) to milliseconds if needed, or assume it's suitable for Date
  // Aptos timestamps are usually microseconds.
  const firstActivityTimestamp = aggregate?.min?.timestamp;

  return {
    totalTransactions,
    firstActivityTimestamp,
    loading,
    error,
  };
}
