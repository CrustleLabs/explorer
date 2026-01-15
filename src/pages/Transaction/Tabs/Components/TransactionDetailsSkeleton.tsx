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
                Account Information
              </Typography>
            </Stack>

            {/* User */}
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
                User
              </Typography>
              <SkeletonBlock width="100%" height={32} />
            </Box>

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
                Unrealized P&L
              </Typography>
              <SkeletonBlock width="60%" height={28} />
            </Box>

            {/* Total P&L */}
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
                Total P&L
              </Typography>
              <SkeletonBlock width="65%" height={28} />
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
