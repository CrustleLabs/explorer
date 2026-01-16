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

export function useGetDexEvents(transaction_id: string | undefined) {
  // Always query all events without block height filter
  const query = GET_DEX_EVENTS_NO_HEIGHT;
  const variables = {transaction_id};

  const result = useGraphqlQuery<{dex_events: DexEvent[]}>(query, {
    variables,
    skip: !transaction_id,
  });

  // Client-side filtering for minimum block height
  let filteredData = result.data;
  if (result.data?.dex_events && result.data.dex_events.length > 0) {
    const events = result.data.dex_events;
    // Find valid heights
    const heights = events
      .map((e) => e.created_height)
      .filter((h): h is number => h !== undefined && h !== null);

    if (heights.length > 0) {
      const minHeight = Math.min(...heights);
      filteredData = {
        dex_events: events.filter((e) => e.created_height === minHeight),
      };
    }
  }

  return {...result, data: filteredData};
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
