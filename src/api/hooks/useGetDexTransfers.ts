import {gql} from "@apollo/client";
import {useQuery as useGraphqlQuery} from "@apollo/client/react";

export interface DexTransfer {
  id: number;
  kind: string;
  sender_address: string;
  sender_sub_number: string;
  recipient_address: string;
  recipient_sub_number: string;
  asset_id: string;
  symbol: string;
  amount: number;
  transaction_version: number;
  created_transaction: string;
  created_height: number;
  created_at: string;
}

const GET_DEX_TRANSFERS = gql`
  query GetDexTransfers($address: String!) {
    dex_transfers(
      where: {
        _or: [
          {sender_address: {_eq: $address}}
          {recipient_address: {_eq: $address}}
        ]
      }
      order_by: {created_at: desc}
    ) {
      id
      kind
      sender_address
      sender_sub_number
      recipient_address
      recipient_sub_number
      asset_id
      symbol
      amount
      transaction_version
      created_transaction
      created_height
      created_at
    }
  }
`;

export function useGetDexTransfers(address: string | undefined) {
  // Convert to EVM address (42 chars) for dex_transfers
  const evmAddress = address ? `0x${address.slice(-40)}` : "";

  const {data, loading, error} = useGraphqlQuery<{
    dex_transfers: DexTransfer[];
  }>(GET_DEX_TRANSFERS, {
    variables: {address: evmAddress},
    skip: !evmAddress,
  });

  return {data, isLoading: loading, error};
}
