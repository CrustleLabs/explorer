import {gql} from "@apollo/client";
import {useQuery as useGraphqlQuery} from "@apollo/client/react";

// Event Type Enum
export enum DexEventType {
  // trigger
  Triggering = 0,
  Triggered = 1,
  // user
  Place = 10,
  Replace = 11,
  Cancel = 12,
  // engine
  Reject = 20,
  Filled = 21,
  ADL = 22,
}

export type DexEvent = {
  id: number;
  address: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event_payload: any;
  event_type: number;
};

const GET_DEX_EVENTS = gql`
  query GetDexEvents($transaction_id: String!) {
    dex_events(where: {transaction_id: {_eq: $transaction_id}}) {
      id
      address
      event_payload
      event_type
    }
  }
`;

export function useGetDexEvents(transaction_id: string | undefined) {
  return useGraphqlQuery<{dex_events: DexEvent[]}>(GET_DEX_EVENTS, {
    variables: {transaction_id},
    skip: !transaction_id,
  });
}
