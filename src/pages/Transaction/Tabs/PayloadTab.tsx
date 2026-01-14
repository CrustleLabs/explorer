import React from "react";
import {Types} from "aptos";
import {Box, Stack, Typography} from "@mui/material";
import EmptyTabContent from "../../../components/IndividualPageContent/EmptyTabContent";
import JsonViewCard from "../../../components/IndividualPageContent/JsonViewCard";
import AccountAddressPill from "./Components/AccountAddressPill";

type PayloadTabProps = {
  transaction: Types.Transaction;
};

export default function PayloadTab({transaction}: PayloadTabProps) {
  if (!("payload" in transaction)) {
    return <EmptyTabContent />;
  }

  const payload = transaction.payload;
  const isEntryFunction = payload.type === "entry_function_payload";

  // Extract address from function if possible, e.g. "0x1::coin::transfer" -> "0x1"
  let functionAddress = "";
  if (
    isEntryFunction &&
    "function" in payload &&
    typeof payload.function === "string"
  ) {
    functionAddress = payload.function.split("::")[0];
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
              backgroundColor: "#B692F4", // Matches design context brand color-400
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3.66667 6.10287H5M3.66667 8.79221H5M9.66667 13H11.3333M7.66667 8.79221H7.67333M7.66667 6.10287H7.67333M10.3333 13H4.2C3.0799 13 2.51984 13 2.09202 12.7802C1.71569 12.5868 1.40973 12.2782 1.21799 11.8987C1 11.4672 1 10.9024 1 9.77279V2.75166C1 2.14293 1 1.83857 1.1268 1.66206C1.23741 1.5081 1.40748 1.40856 1.59491 1.3881C1.80978 1.36464 2.07181 1.51565 2.59588 1.81766L2.80412 1.93766C2.99701 2.04882 3.09346 2.10441 3.19589 2.12617C3.28652 2.14543 3.38014 2.14543 3.47078 2.12617C3.57321 2.10441 3.66965 2.04882 3.86255 1.93766L5.13745 1.20295C5.33035 1.09179 5.42679 1.03621 5.52922 1.01444C5.61986 0.995185 5.71348 0.995185 5.80411 1.01444C5.90654 1.03621 6.00299 1.09179 6.19588 1.20295L7.47079 1.93766C7.66367 2.04882 7.76013 2.10441 7.86255 2.12617C7.95319 2.14543 8.04681 2.14543 8.13745 2.12617C8.23987 2.10441 8.33632 2.04882 8.52922 1.93766L8.73745 1.81766C9.26152 1.51565 9.52355 1.36464 9.73842 1.3881C9.92585 1.40856 10.0959 1.5081 10.2065 1.66206C10.3333 1.83857 10.3333 2.14293 10.3333 2.75166V8.29366M10.3333 7.62132H13V11.6553C13 12.398 12.403 13 11.6667 13C10.9303 13 10.3333 12.398 10.3333 11.6553V7.62132Z"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
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
            Payload Details
          </Typography>
        </Stack>

        {/* Content Stack */}
        <Stack spacing={3}>
          {/* Account Address */}
          {functionAddress && (
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
                Account Address
              </Typography>
              <AccountAddressPill address={functionAddress} />
            </Box>
          )}

          {/* Type */}
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
              Type
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "14px",
                fontFamily: '"SF Pro", sans-serif',
                lineHeight: "18px",
              }}
            >
              {payload.type}
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
              data={payload}
              hideBackground={true}
              collapsedByDefault={true}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
