import React from "react";
import {Box, Stack, Typography, Grid, Tab, Tabs} from "@mui/material";
import SkeletonBlock from "../../../../components/SkeletonBlock";

/**
 * Skeleton component for Transaction Details page
 * Matches the Figma design for loading state
 */
export default function TransactionDetailsSkeleton() {
  return (
    <Box sx={{minHeight: "calc(100vh - 200px)"}}>
      {/* Top Stats Row */}
      <Grid container spacing={1.5} marginBottom={4} alignItems="stretch">
        {/* Status */}
        <Grid size={{xs: 6, sm: 6, md: 3}} sx={{display: "flex"}}>
          <Box
            sx={{
              backgroundColor: "#232227",
              borderRadius: "12px",
              p: "16px 20px",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="#999"
              display="block"
              mb={1.5}
              fontFamily='"SF Pro", sans-serif'
              fontSize="12px"
            >
              Status
            </Typography>
            <SkeletonBlock width={80} height={28} />
          </Box>
        </Grid>
        {/* Block */}
        <Grid size={{xs: 6, sm: 6, md: 3}} sx={{display: "flex"}}>
          <Box
            sx={{
              backgroundColor: "#232227",
              borderRadius: "12px",
              p: "16px 20px",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="#999"
              display="block"
              mb={1.5}
              fontFamily='"SF Pro", sans-serif'
              fontSize="12px"
            >
              Block
            </Typography>
            <SkeletonBlock width={100} height={24} />
          </Box>
        </Grid>
        {/* Time */}
        <Grid size={{xs: 6, sm: 6, md: 3}} sx={{display: "flex"}}>
          <Box
            sx={{
              backgroundColor: "#232227",
              borderRadius: "12px",
              p: "16px 20px",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="#999"
              display="block"
              mb={1.5}
              fontFamily='"SF Pro", sans-serif'
              fontSize="12px"
            >
              Time
            </Typography>
            <SkeletonBlock width={80} height={24} />
          </Box>
        </Grid>
        {/* Type */}
        <Grid size={{xs: 6, sm: 6, md: 3}} sx={{display: "flex"}}>
          <Box
            sx={{
              backgroundColor: "#232227",
              borderRadius: "12px",
              p: "16px 20px",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="#999"
              display="block"
              mb={1.5}
              fontFamily='"SF Pro", sans-serif'
              fontSize="12px"
            >
              Type
            </Typography>
            <SkeletonBlock width={60} height={24} />
          </Box>
        </Grid>
      </Grid>

      {/* Main Content Layout */}
      <Grid container spacing={3}>
        {/* Left side - Transaction Details */}
        <Grid size={{xs: 12, md: 8}}>
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
                  backgroundColor: "#8FC7FA",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{width: 24, height: 24}}
                >
                  <path
                    d="M5.5 9.47139C6.94445 7.66667 9.44809 5.5 12.0006 5.5C15.3459 5.5 18.1009 8.02742 18.4603 11.277M5.5 9.47139V6.22139M5.5 9.47139H8.75M5.54129 12.7249C5.90198 15.9732 8.65633 18.4991 12.0006 18.4991C14.5514 18.4991 17.0556 16.3333 18.5 14.5269M18.5 14.5269V17.7769M18.5 14.5269H15.25"
                    stroke="black"
                    strokeWidth="1.86667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                Transaction Details
              </Typography>
            </Stack>

            {/* Hash */}
            <Box mb={3}>
              <Typography
                sx={{
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: "18px",
                  mb: 1,
                  fontFamily: '"SF Pro", sans-serif',
                }}
              >
                Hash
              </Typography>
              <SkeletonBlock width="80%" height={40} borderRadius="40px" />
            </Box>

            {/* Action details */}
            <Box mb={3}>
              <Typography
                sx={{
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: "18px",
                  mb: 1,
                  fontFamily: '"SF Pro", sans-serif',
                }}
              >
                Action details
              </Typography>
              <SkeletonBlock width="60%" height={28} />
            </Box>

            {/* Timestamp */}
            <Box mb={3}>
              <Typography
                sx={{
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: "18px",
                  mb: 1,
                  fontFamily: '"SF Pro", sans-serif',
                }}
              >
                Timestamp
              </Typography>
              <SkeletonBlock width={180} height={20} />
            </Box>

            {/* Transaction Data Accordion */}
            <Box
              sx={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                pt: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#999",
                  fontSize: "14px",
                  fontFamily: '"SF Pro", sans-serif',
                }}
              >
                Transaction Data
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right side - Account Information */}
        <Grid size={{xs: 12, md: 4}}>
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
                  backgroundColor: "#B692F4",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.6523 17.2304C15.5872 15.8247 13.8996 14.9167 12 14.9167C10.1004 14.9167 8.4128 15.8247 7.34769 17.2304M16.6523 17.2304C18.0927 15.9483 19 14.0801 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 14.0801 5.90728 15.9483 7.34769 17.2304M16.6523 17.2304C15.4156 18.3312 13.7859 19 12 19C10.2141 19 8.58439 18.3312 7.34769 17.2304M14.3333 10.25C14.3333 11.5387 13.2887 12.5833 12 12.5833C10.7113 12.5833 9.66667 11.5387 9.66667 10.25C9.66667 8.96134 10.7113 7.91667 12 7.91667C13.2887 7.91667 14.3333 8.96134 14.3333 10.25Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
              <Typography
                variant="h6"
                fontFamily='"SF Pro", sans-serif'
                fontWeight={600}
                fontSize="18px"
                color="#fff"
              >
                Account Information
              </Typography>
            </Stack>

            {/* User */}
            <Box>
              <Typography
                sx={{
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: "18px",
                  mb: 1,
                  fontFamily: '"SF Pro", sans-serif',
                }}
              >
                User
              </Typography>
              <SkeletonBlock width="100%" height={44} borderRadius="40px" />
            </Box>

            {/* Divider */}
            <Box
              sx={{
                height: "1px",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                my: "32px",
              }}
            />

            {/* Total Value */}
            <Box mb={3}>
              <Typography
                sx={{
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: "18px",
                  mb: 1,
                  fontFamily: '"SF Pro", sans-serif',
                }}
              >
                Total Value
              </Typography>
              <SkeletonBlock width="70%" height={28} />
            </Box>

            {/* Unrealized P&L */}
            <Box>
              <Typography
                sx={{
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: "18px",
                  mb: 1,
                  fontFamily: '"SF Pro", sans-serif',
                }}
              >
                Unrealized P&L
              </Typography>
              <SkeletonBlock width="60%" height={28} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* All Transactions Section */}
      <Box
        sx={{
          backgroundColor: "#16141a",
          border: "1.5px solid rgba(255,255,255,0.06)",
          borderRadius: "24px",
          padding: "24px",
          mt: 4,
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <Box
            sx={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#8FC7FA",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{width: 24, height: 24}}
            >
              <path
                d="M5.5 9.47139C6.94445 7.66667 9.44809 5.5 12.0006 5.5C15.3459 5.5 18.1009 8.02742 18.4603 11.277M5.5 9.47139V6.22139M5.5 9.47139H8.75M5.54129 12.7249C5.90198 15.9732 8.65633 18.4991 12.0006 18.4991C14.5514 18.4991 17.0556 16.3333 18.5 14.5269M18.5 14.5269V17.7769M18.5 14.5269H15.25"
                stroke="black"
                strokeWidth="1.86667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
          <Typography
            variant="h6"
            fontFamily='"SF Pro", sans-serif'
            fontWeight={700}
            fontSize="18px"
            color="#fff"
          >
            All Transactions
          </Typography>
        </Stack>

        {/* Tabs */}
        <Tabs
          value={0}
          sx={{
            mb: 2,
            minHeight: "32px",
            "& .MuiTabs-indicator": {display: "none"},
          }}
        >
          <Tab
            label="Open Positions"
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "14px",
              fontFamily: '"SF Pro", sans-serif',
              textTransform: "none",
              minHeight: "32px",
              padding: "6px 12px",
            }}
          />
          <Tab
            label="Active Transactions"
            sx={{
              color: "#999",
              fontWeight: 400,
              fontSize: "14px",
              fontFamily: '"SF Pro", sans-serif',
              textTransform: "none",
              minHeight: "32px",
              padding: "6px 12px",
            }}
          />
          <Tab
            label="Spot Balances"
            sx={{
              color: "#999",
              fontWeight: 400,
              fontSize: "14px",
              fontFamily: '"SF Pro", sans-serif',
              textTransform: "none",
              minHeight: "32px",
              padding: "6px 12px",
            }}
          />
        </Tabs>

        {/* Table Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: 2,
            py: 1.5,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {[
            "Asset",
            "Mark",
            "Entry",
            "Positions Value",
            "PnL",
            "ROI",
            "Margin",
            "Funding",
          ].map((header) => (
            <Typography
              key={header}
              sx={{
                color: "#666",
                fontSize: "11px",
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              {header}
            </Typography>
          ))}
        </Box>

        {/* Skeleton Rows */}
        {Array.from({length: 5}).map((_, i) => (
          <Box
            key={i}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: 2,
              py: 1.5,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {Array.from({length: 8}).map((_, j) => (
              <SkeletonBlock key={j} width="80%" height={20} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
