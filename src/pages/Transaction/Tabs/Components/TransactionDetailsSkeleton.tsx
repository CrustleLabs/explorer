import React from "react";
import {Box, Stack, Typography, Grid} from "@mui/material";
import SkeletonBlock from "../../../../components/SkeletonBlock";
import StyledTabs from "../../../../components/StyledTabs";
import StyledTab from "../../../../components/StyledTab";
import TransactionSidebar from "../../Sidebar";

/**
 * Skeleton component for Transaction Details page
 * Matches the Figma design for loading state
 */
export default function TransactionDetailsSkeleton() {
  return (
    <Box sx={{minHeight: "calc(100vh - 200px)"}}>
      {/* Tabs */}
      <Box sx={{width: "100%"}}>
        <Box marginBottom={4}>
          <StyledTabs value="overview" onChange={() => {}}>
            <StyledTab
              value="overview"
              label="Overview"
              isFirst={true}
              isLast={false}
            />
            <StyledTab
              value="events"
              label="Events"
              isFirst={false}
              isLast={false}
            />
            <StyledTab
              value="payload"
              label="Payload"
              isFirst={false}
              isLast={true}
            />
          </StyledTabs>
        </Box>

        {/* Main Content Layout */}
        <Grid container spacing={3} marginTop={2}>
          {/* Left side - Stats Row AND Transaction Details */}
          <Grid size={{xs: 12, md: 8}}>
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

          {/* Right side - Account Information - REUSING REAL COMPONENT IN LOADING MODE */}
          <Grid size={{xs: 12, md: 4}}>
            <TransactionSidebar isLoading={true} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
