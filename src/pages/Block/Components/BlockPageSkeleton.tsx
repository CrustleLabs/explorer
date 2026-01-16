import React from "react";
import {Box, Stack, Typography, Grid} from "@mui/material";
import SkeletonBlock from "../../../components/SkeletonBlock";

const sectionLabelStyle = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "18px",
  mb: 1,
  fontFamily: '"SF Pro", sans-serif',
  fontWeight: 400,
};

function BlockOverviewSkeleton() {
  return (
    <Box
      sx={{
        backgroundColor: "#16141A",
        border: "0.5px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "24px",
        p: "20px",
      }}
    >
      {/* Block Height */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Block Height</Typography>
        <SkeletonBlock width={120} height={24} />
      </Box>

      {/* Transactions */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Transactions</Typography>
        <SkeletonBlock width={200} height={20} />
      </Box>

      {/* Proposer */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Proposer</Typography>
        <SkeletonBlock width={150} height={32} />
      </Box>

      {/* Timestamp */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Timestamp</Typography>
        <SkeletonBlock width={180} height={20} />
      </Box>

      {/* Epoch */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Epoch</Typography>
        <SkeletonBlock width={60} height={20} />
      </Box>

      {/* Round */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Round</Typography>
        <SkeletonBlock width={60} height={20} />
      </Box>

      {/* Previous Block */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Previous Block</Typography>
        <SkeletonBlock width={100} height={20} />
      </Box>

      {/* Next Block */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Next Block</Typography>
        <SkeletonBlock width={100} height={20} />
      </Box>
    </Box>
  );
}

function BlockTransactionsSkeleton() {
  return (
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
            backgroundColor: "#232323",
          }}
        />
        <Typography
          variant="h6"
          fontFamily='"SF Pro", sans-serif'
          fontWeight={700}
          fontSize="18px"
          color="#333"
        >
          All Transactions
        </Typography>
      </Stack>

      {/* Skeleton Rows */}
      <Stack spacing={2}>
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: 2,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <SkeletonBlock width={100} height={20} />
            <SkeletonBlock width={200} height={20} />
            <SkeletonBlock width={80} height={20} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default function BlockPageSkeleton() {
  return (
    <Grid container spacing={1}>
      {/* Mock PageHeader space if needed, or render placeholder */}
      {/* PageHeader is usually handled global or generic.
           In Block/Index.tsx it is <PageHeader /> then Grid.
           We'll just assume PageHeader is rendered in the parent or separately.
           But wait, in Index.tsx, PageHeader IS inside the return. 
           We should ideally render generic PageHeader.
           However, we can just perform the skeleton part.
       */}

      <Grid size={{xs: 12}}>
        <Stack direction="column" spacing={4} marginTop={2}>
          {/* Title Skeleton */}
          <Box>
            <Typography variant="h4" color="#333" mb={2}>
              <SkeletonBlock width={200} height={40} />
            </Typography>
          </Box>
          <BlockOverviewSkeleton />
          <BlockTransactionsSkeleton />
        </Stack>
      </Grid>
    </Grid>
  );
}
