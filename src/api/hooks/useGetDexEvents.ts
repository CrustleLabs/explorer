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
  Deal = 13,
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
  created_height?: number;
};

const GET_DEX_EVENTS = gql`
  query GetDexEvents($transaction_id: String!, $block_height: bigint) {
    dex_events(
      where: {
        transaction_id: {_eq: $transaction_id}
        created_height: {_eq: $block_height}
      }
    ) {
      id
      address
      event_payload
      event_type
      created_height
    }
  }
`;

// Query without block_height filter (for backwards compatibility)
const GET_DEX_EVENTS_NO_HEIGHT = gql`
  query GetDexEventsNoHeight($transaction_id: String!) {
    dex_events(where: {transaction_id: {_eq: $transaction_id}}) {
      id
      address
      event_payload
      event_type
      created_height
    }
  }
`;

export function useGetDexEvents(
  transaction_id: string | undefined,
  block_height?: string | number,
) {
  // Use query with block_height filter if provided
  const query = block_height ? GET_DEX_EVENTS : GET_DEX_EVENTS_NO_HEIGHT;
  const variables = block_height
    ? {transaction_id, block_height: Number(block_height)}
    : {transaction_id};

  return useGraphqlQuery<{dex_events: DexEvent[]}>(query, {
    variables,
    skip: !transaction_id,
  });
}

/**
 * Helper function to get display name for event type
 * Treats Deal (13) as Place for display purposes
 */
export function getEventTypeDisplayName(eventType: number): string {
  // Treat Deal as Place
  if (eventType === DexEventType.Deal) {
    return DexEventType[DexEventType.Place];
  }
  return DexEventType[eventType] || `Unknown (${eventType})`;
}
