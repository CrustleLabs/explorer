import React from "react";
import {Box, Grid} from "@mui/material";
import EmptyValue from "./ContentValue/EmptyValue";

type ContentRowProps = {
  title: string;
  value: React.ReactNode;
  tooltip?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  i?: any;
};

export default function ContentRow({
  title,
  value,
  tooltip,
  i,
}: ContentRowProps) {
  return (
    <Box>
      <Grid
        container
        rowSpacing={0.5}
        columnSpacing={4}
        alignItems="start"
        key={i}
      >
        <Grid container size={{xs: 12, sm: 3}}>
          <Box
            sx={{
              fontSize: "14px",
              color: "#999",
              fontFamily: '"SF Pro", sans-serif',
            }}
          >
            {title}
            <Box
              component="span"
              sx={{
                display: "inline",
                whiteSpace: "nowrap",
              }}
            >
              &nbsp;
              <Box sx={{display: "inline-block"}}>{tooltip}</Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          size={{xs: 12, sm: 9}}
          sx={{
            fontSize: "14px",
            fontFamily: '"SF Pro", sans-serif',
            overflow: "auto",
            color: "#fff", // Default value color
          }}
        >
          {value ? (
            <Box
              sx={{
                display: "inline-flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1,
              }}
            >
              {value}
            </Box>
          ) : (
            <EmptyValue />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
