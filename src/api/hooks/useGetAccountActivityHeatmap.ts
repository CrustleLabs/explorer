import {gql} from "@apollo/client";
import {useQuery as useGraphqlQuery} from "@apollo/client/react";
import {tryStandardizeAddress} from "../../utils";
import moment from "moment";

const GET_ACCOUNT_ACTIVITY = gql`
  query GetAccountActivity($address: String!, $since: timestamp!) {
    user_transactions(
      where: {sender: {_eq: $address}, timestamp: {_gte: $since}}
    ) {
      timestamp
    }
  }
`;

export type HeatmapData = {
  date: string; // YYYY-MM-DD
  count: number;
  level: number; // 0-4
};

export function useGetAccountActivityHeatmap(address: string) {
  const standardizedAddress = tryStandardizeAddress(address);

  // User requested "Current Week"
  // Fetch from start of the current week (Sunday or Monday based on locale, moment usually traces to Sunday by default in US locale, Monday in others)
  const startOfWeek = moment().startOf("week").toISOString();

  const {data, loading, error} = useGraphqlQuery<{
    user_transactions: {timestamp: string}[];
  }>(GET_ACCOUNT_ACTIVITY, {
    variables: {
      address: standardizedAddress,
      since: startOfWeek,
    },
    skip: !standardizedAddress,
  });

  return {
    transactions: data?.user_transactions || [],
    loading,
    error,
  };
}
