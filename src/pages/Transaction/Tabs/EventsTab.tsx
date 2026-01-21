import React from "react";
import {Types} from "aptos";
import EmptyTabContent from "../../../components/IndividualPageContent/EmptyTabContent";
import JsonViewCard from "../../../components/IndividualPageContent/JsonViewCard";
import {
  useGetDexEvents,
  DexEvent,
  getEventTypeDisplayName,
} from "../../../api/hooks/useGetDexEvents";
import {Box, Stack, Typography, CircularProgress} from "@mui/material";
import AccountAddressPill from "./Components/AccountAddressPill";

type EventsTabProps = {
  transaction: Types.Transaction;
};

// Helper to check if this is a Transfer type transaction
function isTransferTransaction(transaction: Types.Transaction): boolean {
  if (!("payload" in transaction)) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = (transaction as any).payload;
  return (
    payload?.type === "dex_orderless_payload" &&
    payload?.dex_type === "dex_transfer_payload"
  );
}

// Helper to check if this is an Order type transaction (dex_payload)
function isOrderTransaction(transaction: Types.Transaction): boolean {
  if (!("payload" in transaction)) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = (transaction as any).payload;
  return (
    payload?.type === "dex_orderless_payload" &&
    payload?.dex_type === "dex_payload"
  );
}

// Helper to extract event name from type string
// e.g., "0x0000...0001::fungible_asset::Withdraw" -> "Withdraw"
function extractEventName(eventType: string): string {
  const parts = eventType.split("::");
  return parts[parts.length - 1] || eventType;
}

// Filter out FeeStatement events
function filterOutFeeEvents(events: Types.Event[]): Types.Event[] {
  return events.filter(
    (event) => !event.type.includes("::transaction_fee::FeeStatement"),
  );
}

export default function EventsTab({transaction}: EventsTabProps) {
  const isTransfer = isTransferTransaction(transaction);
  const isOrder = isOrderTransaction(transaction);

  // Use native events for Transfer and Order transactions
  const useNativeEvents = isTransfer || isOrder;

  // Only Fetch Dex Events via GraphQL for transactions that don't use native events
  const {data: dexEventsData, loading} = useGetDexEvents(
    useNativeEvents ? "" : transaction.hash, // Skip GraphQL call for Transfer and Order
  );
  const dexEvents = dexEventsData?.dex_events || [];

  // For Transfer and Order transactions, use native events from the transaction
  const nativeEvents = React.useMemo(() => {
    if (!useNativeEvents) return [];
    if (!("events" in transaction)) return [];
    return filterOutFeeEvents((transaction as Types.UserTransaction).events);
  }, [transaction, useNativeEvents]);

  if (!useNativeEvents && loading) {
    return (
      <Box sx={{display: "flex", justifyContent: "center", p: 4}}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  // No events to show
  if (!useNativeEvents && dexEvents.length === 0) {
    return <EmptyTabContent />;
  }
  if (useNativeEvents && nativeEvents.length === 0) {
    return <EmptyTabContent />;
  }

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#16141A",
          border: "0.5px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "24px",
          p: "20px",
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <Box
            sx={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#EE914C",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M12.373 4.42285C14.9009 4.42289 16.9502 6.47212 16.9502 9C16.9502 11.5279 14.9009 13.5771 12.373 13.5771C11.6391 13.5771 10.9419 13.4033 10.3242 13.0938C9.72868 12.7951 9.48765 12.0703 9.78613 11.4746C10.0847 10.879 10.8096 10.6382 11.4053 10.9365C11.695 11.0817 12.0229 11.1641 12.373 11.1641C13.5681 11.164 14.5371 10.1951 14.5371 9C14.5371 7.80492 13.5681 6.83598 12.373 6.83594C11.1779 6.83594 10.209 7.8049 10.209 9C10.209 9.04693 10.2054 9.09313 10.2002 9.13867C10.1268 11.6024 8.10846 13.5771 5.62695 13.5771C3.09907 13.5771 1.04984 11.5279 1.0498 9C1.04984 6.47212 3.09907 4.42289 5.62695 4.42285C6.36089 4.42285 7.05807 4.59673 7.67578 4.90625C8.27133 5.20489 8.51235 5.92971 8.21387 6.52539C7.91535 7.12105 7.19045 7.36181 6.59473 7.06348C6.305 6.9183 5.97714 6.83594 5.62695 6.83594C4.43188 6.83598 3.46292 7.80492 3.46289 9C3.46293 10.1951 4.43188 11.164 5.62695 11.1641C6.82206 11.1641 7.79098 10.1951 7.79102 9C7.79102 8.95278 7.79354 8.90616 7.79883 8.86035C7.87269 6.39707 9.89186 4.42285 12.373 4.42285Z"
                fill="black"
              />
            </svg>
          </Box>
          <Typography
            variant="h6"
            fontFamily='"SF Pro", sans-serif'
            fontWeight={700}
            fontSize="20px"
            color="#fff"
          >
            Event Details
          </Typography>
        </Stack>

        {/* Content Stack */}
        <Stack spacing={2}>
          {/* Display native events for Transfer and Order transactions */}
          {useNativeEvents &&
            nativeEvents.map((event: Types.Event, i: number) => (
              <Box
                key={`native-event-${i}`}
                sx={{
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "16px",
                  p: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                }}
              >
                {/* Account Address */}
                <Box mb={3}>
                  <Typography
                    sx={{
                      color: "#666",
                      fontSize: "14px",
                      fontFamily: '"SF Pro", sans-serif',
                      lineHeight: "18px",
                      mb: "12px",
                    }}
                  >
                    Account Address
                  </Typography>
                  <AccountAddressPill
                    address={(transaction as Types.UserTransaction).sender}
                  />
                </Box>

                {/* Name */}
                <Box mb={3}>
                  <Typography
                    sx={{
                      color: "#666",
                      fontSize: "14px",
                      fontFamily: '"SF Pro", sans-serif',
                      lineHeight: "18px",
                      mb: "12px",
                    }}
                  >
                    Name
                  </Typography>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "14px",
                      fontFamily: '"SF Pro", sans-serif',
                      lineHeight: "18px",
                    }}
                  >
                    {extractEventName(event.type)}
                  </Typography>
                </Box>

                {/* Data */}
                <Box>
                  <Typography
                    sx={{
                      color: "#666",
                      fontSize: "14px",
                      fontFamily: '"SF Pro", sans-serif',
                      lineHeight: "18px",
                      mb: "12px",
                    }}
                  >
                    Data
                  </Typography>
                  <JsonViewCard
                    data={event.data}
                    hideBackground={true}
                    collapsedByDefault={true}
                  />
                </Box>
              </Box>
            ))}

          {/* Display Dex events for transactions that don't use native events */}
          {!useNativeEvents &&
            dexEvents.map((event: DexEvent, i: number) => (
              <Box
                key={`dex-event-${i}`}
                sx={{
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "16px",
                  p: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                }}
              >
                {/* Account Address */}
                <Box mb={3}>
                  <Typography
                    sx={{
                      color: "#666",
                      fontSize: "14px",
                      fontFamily: '"SF Pro", sans-serif',
                      lineHeight: "18px",
                      mb: "12px",
                    }}
                  >
                    Account Address
                  </Typography>
                  <AccountAddressPill address={event.address} />
                </Box>

                {/* Name */}
                <Box mb={3}>
                  <Typography
                    sx={{
                      color: "#666",
                      fontSize: "14px",
                      fontFamily: '"SF Pro", sans-serif',
                      lineHeight: "18px",
                      mb: "12px",
                    }}
                  >
                    Name
                  </Typography>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "14px",
                      fontFamily: '"SF Pro", sans-serif',
                      lineHeight: "18px",
                    }}
                  >
                    {getEventTypeDisplayName(event.event_type)}
                  </Typography>
                </Box>

                {/* Data */}
                <Box>
                  <Typography
                    sx={{
                      color: "#666",
                      fontSize: "14px",
                      fontFamily: '"SF Pro", sans-serif',
                      lineHeight: "18px",
                      mb: "12px",
                    }}
                  >
                    Data
                  </Typography>
                  <JsonViewCard
                    data={event.event_payload}
                    hideBackground={true}
                    collapsedByDefault={true}
                  />
                </Box>
              </Box>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}
