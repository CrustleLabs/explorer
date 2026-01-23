import {gql} from "@apollo/client";
import {useQuery as useGraphqlQuery} from "@apollo/client/react";

const GET_ACCOUNT_ORDERS = gql`
  query GetAccountOrders($address: String!) {
    dex_orders(
      where: {address: {_eq: $address}}
      order_by: {place_at: desc}
      limit: 8
    ) {
      id
      ticker
      order_side
      size
      filled_size
      price
      status
      place_at
      created_transaction_version
    }
  }
`;

export type Order = {
  id: number;
  ticker: string;
  order_side: number;
  size: number;
  filled_size: number;
  price: number;
  status: number;
  place_at: string;
  created_transaction_version?: string;
};

export function useGetAccountOrders(address: string) {
  // Convert to EVM address (42 chars) for dex_orders
  const evmAddress = address ? `0x${address.slice(-40)}` : "";

  const {data, loading, error} = useGraphqlQuery<{dex_orders: Order[]}>(
    GET_ACCOUNT_ORDERS,
    {
      variables: {address: evmAddress},
      skip: !evmAddress,
    },
  );

  return {
    orders: data?.dex_orders || [],
    loading,
    error,
  };
}
