import {useNavigate, useParams} from "react-router-dom";
import {Stack, Grid, Alert} from "@mui/material";
import React from "react";
import BlockTitle from "./Title";
import BlockTabs from "./Tabs";
import {useGetBlockByHeight} from "../../api/hooks/useGetBlock";
import Error from "./Error";
import {BackButton} from "../../components/GoBack";

export default function BlockPage() {
  const navigate = useNavigate();
  const {height} = useParams();
  const actualHeight = parseInt(height ?? "");

  const {data, isLoading, error} = useGetBlockByHeight({
    height: actualHeight,
  });

  if (error) {
    return <Error error={error} height={height ?? ""} />;
  }

  if (!isLoading && !data) {
    return (
      <Alert severity="error">
        Got an empty response fetching block with height {height}
        <br />
        Try again later
      </Alert>
    );
  }

  return (
    <Grid container>
      <BackButton handleClick={() => navigate(-1)} />
      <Grid size={{xs: 12}}>
        <Stack direction="column" spacing={4} marginTop={2}>
          <BlockTitle height={actualHeight} />
          <BlockTabs data={data} isLoading={isLoading} />
        </Stack>
      </Grid>
    </Grid>
  );
}
