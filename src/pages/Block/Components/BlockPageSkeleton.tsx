import {Box, Grid, Skeleton, Stack} from "@mui/material";
import React from "react";
import SkeletonBlock from "../../../components/SkeletonBlock";

export default function BlockPageSkeleton() {
  return (
    <Grid container spacing={1}>
      <Grid size={{xs: 12}}>
        <Stack direction="column" spacing={4} marginTop={2}>
          {/* Tabs Skeleton */}
          <Stack direction="column" spacing={2}>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
              <Stack direction="row" spacing={2}>
                <SkeletonBlock width={100} height={40} />
                <SkeletonBlock width={100} height={40} />
              </Stack>
            </Box>

            {/* Overview Content Skeleton */}
            <Stack spacing={4}>
              {/* Stats Row */}
              <Stack direction="row" spacing={2} width="100%">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width="100%"
                    height={100}
                    sx={{borderRadius: "16px", bgcolor: "#16141A"}}
                  />
                ))}
              </Stack>

              <Grid container spacing={4}>
                <Grid size={{xs: 12, md: 8}}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={300}
                    sx={{borderRadius: "24px", bgcolor: "#16141A"}}
                  />
                </Grid>
                <Grid size={{xs: 12, md: 4}}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={300}
                    sx={{borderRadius: "24px", bgcolor: "#16141A"}}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
